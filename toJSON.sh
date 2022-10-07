echo "" > output.js
echo "data = '"  | tr '\n' ' ' >> output.js
node main.js | tr '\n' ' ' >> output.js 
echo "'" >> output.js
#git add output.txt
#git commit -m "automated output update"
#git push