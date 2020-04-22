rm -rf platforms/browser/
ionic cordova build browser --prod --release
rm -rf ../agrofloresta-server/static/*
cp platforms/browser/www/* ../agrofloresta-server/static/ -rf
cd ../agrofloresta-server
git status
git add .
git commit -a -m 'Adiciona build do app web agrofloresta para deploy'
git push origin master
cd ../agrofloresta
