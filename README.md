This is a large file uploader for the [Form Service API](https://github.com/cityofaustin/form-service-api), for considerations on how it works you can look at the architecture section. For a demonstration you can visit the links below.

Front-end is written in react:
https://d1tox4tz6kpvtt.cloudfront.net/fileupload.html?case=C3D-123-9876

Where the case number has to follow that format:
[3 digit uppercase alphanumeric]-[3 digit numeric]-[4 digit numeric]

At the moment you can write any code you want without any restrictions; however, the backend is coded to be strict to be strict in the case number format.

## Architecture

1. The app will request an authorization (signature) token from the API.
2. The API will request and generate the token from S3, and return it to the front-end. The API will have a preset file name it will expect.
3. The the file name is sent back to the front end, along with the required authorization tokens.
4. The front end will compile a request, add the tokens in the headers and upload the file to s3.

## Testing

The app has been tested uploading a 1gb file on Wifi, it took about 15-20 minutes:

![Screen_Shot_2018-12-21_at_1_58_42_AM.png](https://images.zenhubusercontent.com/5b7edad7290aac725aec290c/f74f89e1-39f6-4baa-ad46-a941d8cd38a8)

On a mac, you can create a large dummy file using the following command:

`mkfile -n 1g ~/Desktop/testfile.mp4`

The file will be empty, however you can adjust multiple file sizes: 2-3gb, etc.


## Running the app

You can run the app using yarn start or npm start.
