var Curl = require( 'node-libcurl' ).Curl;

var curl = new Curl(),
    close = curl.close.bind( curl );

curl.setOpt( curl.option.URL, '127.0.0.1/upload.php' );
curl.setOpt( curl.option.HTTPPOST, [
    { name: 'input-name', file: '/file/path', type: 'text/html' },
    { name: 'input-name2', contents: 'field-contents' }
]);

curl.on( 'end', close );
curl.on( 'error', close );
