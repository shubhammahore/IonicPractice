// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'http://devapi.checkmeinweb.com/APIv2/',
  googleSenderID: '1035035764695',
  mainUrl:'http://devapi.checkmeinweb.com/APIv2/PayUBiz/response.php',
  productinfo: 'Checkin+at+WRIOIN',
  pg:'DC',
  firstname:'Sourabh',
  email:'admin@deviseapps.com',
  phone:7798982716,
  // amazonS3AccessKeyId: 'AKIAJNWYYNDGYOYPEQEA',
  // amazonS3SecretAccessKey: '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',
  // amazonS3Region: 'us-east-1',
  // amazonS3Bucket: 'mwrio',
  amazonS3Bucket:'devcheckin',
  amazonS3Region: 'us-east-1',
  amazonS3AccessKeyId: 'AKIAJJPHVATEXRKHYAEA', 
  amazonS3SecretAccessKey: '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',
  google: {
		apiUrl: 'https://www.googleapis.com/oauth2/v3/',
		appId: '1:1035035764695:android:f50cefe959c16665.com.deviseapps.wrio',
		scope: ['email']
	}
};
