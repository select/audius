sqlite3 "$HOME/.config/google-chrome/Profile 1/Local Storage/chrome-extension_jbnkffmindojffecdhbbmekbmkkfpmjd_0.localstorage" 'select value from ItemTable where key like "StreamItems%"'> dump.json
sed -i 's/{"song/,{"song/g' dump.json
echo "[$(cat dump.json)]" > dump.json
sed -i 's/\[,/[/g' dump.json
