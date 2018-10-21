rm -rf platforms/browser/
ionic cordova build browser --prod --release
rm -rf ../image-processor-server/www
cp platforms/browser/www ../image-processor-server/ -rf
cd ../image-processor-server
git status
git add .
git commit -a -m 'Adiciona aplicação agrofloresta'
git push dokku master
git push origin master
cd ../agrofloresta
