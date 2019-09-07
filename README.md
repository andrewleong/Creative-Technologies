# A real-time multi-screen experience web

## Running the server

- This app is no longer available in heroku as I stopped purchasing the hobby dynos, so it can only run in localhost.
- Git clone this repo, then run the command `node server.js` to start the server, you will see the message "Desktop connected" in terminal.
- On your desktop browser, navigate to http://localhost:3000/

## Connecting with second browser

- If you have no mobile phone, you can skip the steps below. Just copy the url provided on the screen and paste in a new browser tab. You might want to shrink the tab or use two desktop screens. Use your mouse to move the object.

1) An Android phone was used to test this project, so if it doesn't work on other devices you can try android phones.

2) Make sure your phone and desktop are connected to the same wifi network, open your phone browser to input the link provided on the screen or use a QR scanner app.

3) In the url, please replace the keyword `localhost` with your current IP address, for example: 192.168.l.555.

4) The full url should look like http://192.168.l.555:3000/mobile/cornetto

5) Your mobile phone will then be connected to the desktop.

## Different browser or device behaviour impacts experience

- It seems that android phones have various default browsers that may impact the experience, due to pulling the browser from top to bottom causing a page reload, which disconnects the phone from the desktop.

- If that is the case, please set your phone’s default browser to “Google Chrome”. Then go to this link, [chrome://flags/#disable-pull-to-refresh-effect](chrome://flags/#disable-pull-to-refresh-effect).

- You will see a highlighted yellow line that says Pull-to-refresh effect Android. Click DISABLE. This disables your browser’s ability to refresh when you scroll down with your finger.

- The purpose is to prevent your finger from accidentally refreshing the browser that will cause a disconnection between the desktop browser and mobile browser.

- To enable the feature again, go back to the same link above and click enable.

## Playing the game

These steps assumed you have opened the project and have played the game. This is a brief walkthrough for the game.

1) To win the game, you have to collect a minimum of 10 heart game object (10 points). After that, to proceed to the winning page, your ice cream game object needs to be fully melted (died). To do that, either hit the orange fire balls (obstacles) or don’t collect more hearts, overtime your ice cream will melt. If you have failed to collect a minimum of 10 points and have melted, it will direct you to the losing page, which will prompt you to come back later to try again.

2) In the winning page, it will show a Congratulations page with the number of points you collected. On your mobile phone, it will display a page and shows you have won a Free Cornetto Ice cream. On the bottom of the page shows a mock up Facebook Post where you can click the POST button.

3) It will redirect you to an image of the Facebook feed, showing you have sent your friend an ice cream with wishes.

4) You can click on the image to view in your friend’s perspective, whom received free redeemable barcodes for the ice cream.
