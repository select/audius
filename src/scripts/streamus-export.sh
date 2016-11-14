playlist=`sqlite3 "$@" 'select value from ItemTable where key="StreamItems";'`
playlist="$(echo $playlist | sed 's/,/","/g')"

sqlite3 "$@" 'select key,value from ItemTable where key like "StreamItems-%"'> streamus.dump.json
sed -i 's/StreamItems/,"StreamItems/g' streamus.dump.json
sed -i 's/|{"song/":{"song/g' streamus.dump.json
echo "{\"StreamusDump\": true,\"playlist\": [\"$playlist\"], \"items\": {$(cat streamus.dump.json)}}" > streamus.dump.json
sed -i 's/{,/{/g' streamus.dump.json

sed -i 's/\\[^"]/X/g' streamus.dump.json

echo ""
echo "------ writing streamus.dump.json"
echo ""
echo "Validate your output with http://zaa.ch/jsonlint/"
echo "then import it at https://audius.rockdapus.org/"
