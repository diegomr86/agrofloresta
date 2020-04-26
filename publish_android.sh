export PATH="$PATH:/usr/local/android-studio/bin"
export ANDROID_HOME="$HOME/Android/Sdk"
export PATH="$PATH:$ANDROID_HOME/tools"
export JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
export PATH="$PATH:$JAVA_HOME/bin"
rm -rf platforms/android/
rm -rf ../apks/agrofloresta.apk
ionic cordova build android --prod --release
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore agrofloresta.keystore /home/diego/dev/agrofloresta/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk agrofloresta
/home/diego/Android/Sdk/build-tools/28.0.2/zipalign -v 4 /home/diego/dev/agrofloresta/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk ../apks/agrofloresta.apk
