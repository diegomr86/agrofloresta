rm -rf platforms/browser/
rm -rf ../apks/agrofloresta.apk
ionic cordova build browser --prod --release
rm -rf ../image-processor-server/www
cp platforms/browser/www ../image-processor-server/ -rf