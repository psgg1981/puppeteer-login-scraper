require('log-timestamp');                   // include timestamps by default in console.log
const puppeteer = require('puppeteer');

// global var to retrieve username and passwd from commande line arg[3] then reuse it in login
global.credentials = { username : '', password : '' }

// global var to keep automation page objects
global.objects;

/* ***************************************************** */
/* *************** Functions declaration *************** */

function loadObjects(filePath) 
{
  var fs = require('fs')
    , filename = filePath;

  console.log('loading objects from ' + filename)
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(filename + ' successfully read ' + data.length + ' chars');

    global.objects = JSON.parse(data);
  });
}

function loadCredentials(filePath) 
{
  var fs = require('fs')
    , filename = filePath;

  console.log('loading credentials from ' + filename)
  fs.readFile(filename, 'utf8', function(err, data) {
    if (err) throw err;
    console.log(filename + ' successfully read ' + data.length + ' chars');

    //text formatted as username:password (assumes ':' is not used in the password)
    global.credentials = JSON.parse(data);    
  });
}

async function loginApp(page) 
{
  try
  {
    console.log('accessing ' + global.objects.loginPage.url)
    await page.goto(global.objects.loginPage.url, {waitUntil: 'networkidle2'});
   
    console.log('typing credentials...');
    //await console.log('u=' + credentials.username + ', p=' + credentials.password);  
    if(await page.$(global.objects.loginPage.usernameInputLocator) && await page.$(global.objects.loginPage.passwordInputLocator))
    {
      await page.type(global.objects.loginPage.usernameInputLocator, global.credentials.username);
      await page.type(global.objects.loginPage.passwordInputLocator, global.credentials.password);
    }
    else 
    {
      throw new Error("unexpected page, can't locate login form");
    }

    console.log('logging in...');

    await Promise.all([       // wait for both click and submit to finish

        page.click(global.objects.loginPage.loginButtonLocator),                  // button click

        await Promise.race([  // wait for either navigation or invalid login msg to occur first

          page.waitForSelector(global.objects.loginPage.invalidLoginMsgLocator),  // check invalid login
          page.waitForNavigation({                                               // check successful login
            //timeout: 10000, 
            //waitUntil: 'domcontentloaded'
          })

          // TO DO: check for successful login e.g. validate loggedInUsername

        ]).catch((e) => {
            throw new Error('unexpected return from login');
          })
      ])
      .catch((e) => {
        throw new Error('unexpected login action');
      });
  }
  catch (e)
  {
    console.log('error occurred ' + e.message);
  }
}

async function capturePDF(page)
{
  // check if working headless
  const version = await page.browser().version();
  // ...since page.pdf only works with headless mode
  if(version.search('Headless') > -1) 
  {
    var capturedFilename = new Date().toISOString().substring(0,19).replace(/:/g,'');
    console.log('capturing screen to ' + capturedFilename + '.pdf');
    await page.pdf({path: capturedFilename, format: 'A4'});
  }
  else
  {
    console.log('ignoring screen capture (running headless)');
  }  
}

async function captureScreen(page)
{
  var capturedFilename = new Date().toISOString().substring(0,19).replace(/:/g,'');
  console.log('capturing screen to ' + capturedFilename + '.png');
  await page.screenshot({path: capturedFilename + '.png'});
}


/* ***************************************************** */
/* ********************* Execution ********************* */

// blocking code: capture command line arguments
try {
  const args = process.argv;
  const cli = args[1].substring(args[1].lastIndexOf('\\')+1, args[1].length)
  if(args.length != 4)
    throw Error('unexpected number of arguments. Usage: node ' + cli + ' <objects-file> <credentials-file>');

  // load page object and user credentials
  loadObjects(args[2]);
  loadCredentials(args[3]);
}
catch (err) {
  console.log(err.message);
  return
}

// non-blocking code: run puppetter automation
(async () => {
  const browser = await puppeteer.launch( { headless : false
                                            ,args: ['--start-maximized']
                                          });
  const page = await browser.newPage();
  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
  });

  await loginApp(page);
  
  await captureScreen(page); 

  await browser.close();
  console.log('...browser closed.');
})();