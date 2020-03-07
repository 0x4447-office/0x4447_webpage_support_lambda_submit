let AWS = require("aws-sdk");

//
//	Initialize AWS Lambda.
//
let lambda = new AWS.Lambda({
	region: process.env.AWS_REGION || 'us-east-1'
});

//
//	LAMBDA_DESCRIPTION
//
exports.handler = (event) => {

	return new Promise(function(resolve, reject) {

        console.log(event);

		//
		//	1. This container holds all the data to be passed around the chain.
		//
		let container = {
			req: {
				data: event
			},
			//
			//	The default response for Lambda.
			//
			res: {
                message: "OK"
            }
		}

		//
		//	->	Start the chain.
		//
		step_one(container)
			.then(function(container) {

				return send_the_email(container);

			}).then(function(container) {

				//
				//  ->  Send back the good news.
				//
				return resolve(container.res);

			}).catch(function(error) {

				//
				//	->	Stop and surface the error.
				//
				return reject(error);

			});
	});
};

//	 _____    _____     ____    __  __   _____    _____   ______    _____
//	|  __ \  |  __ \   / __ \  |  \/  | |_   _|  / ____| |  ____|  / ____|
//	| |__) | | |__) | | |  | | | \  / |   | |   | (___   | |__    | (___
//	|  ___/  |  _  /  | |  | | | |\/| |   | |    \___ \  |  __|    \___ \
//	| |      | | \ \  | |__| | | |  | |  _| |_   ____) | | |____   ____) |
//	|_|      |_|  \_\  \____/  |_|  |_| |_____| |_____/  |______| |_____/
//

//
//
//
function step_one(container)
{
	return new Promise(function(resolve, reject) {

        console.info("step_one");

        //
        //	->	Move to the next promise.
        //
        return resolve(container);

	});
}

//
//
//
function send_the_email(container)
{
	return new Promise(function(resolve, reject) {

		console.info('send_the_email');

		//
		//	1.	Preapre the email data used to construct the final email
		//
		let data = {
			from	: process.env.FROM,
			to		: process.env.TO,
			subject	: "From support page",
			reply_to: container.req.data.email,
			html	: container.req.html 	|| '',
			text	: container.req.data 	|| ''
		};

		//
		//	2.	Prepare the request configuration
		//
		let params = {
			FunctionName: 'front_end_send_email',
			Payload: JSON.stringify(data, null, 2),
		};

		//
		//	3.	Invoke the Lambda Function
		//
		lambda.invoke(params, function(error, data) {

			//
			//	1.	Check if there was an error in invoking the fnction
			//
			if(error)
			{
				return reject(error);
			}

			//
			//	->	Move to the next chain
			//
			return resolve(container);

		});

	});
}
