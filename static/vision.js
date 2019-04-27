// Imports the Google Cloud client libraries
const vision = require('@google-cloud/vision');

// Creates a client
const client = new vision.ImageAnnotatorClient();

async function getLabel() {
	/**
	 * TODO(developer): Uncomment the following lines before running the sample.
	 */
	 const bucketName = 'citrushack2019-a7dd9.appspot.com';
	 const fileName = 'download.jpg';

	// Performs label detection on the gcs file
	const [result] = await client.labelDetection(
	  'gs://${bucketName}/${fileName}'
	);
	const labels = result.labelAnnotations;
	console.log('Labels:');
	labels.forEach(label => console.log(label.description));
}
