rm -rf platforms/browser/
ionic cordova build browser --prod --release
rm -rf ../image-processor-server/www
cp platforms/browser/www ../image-processor-server/ -rf