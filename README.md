<h1  align='center'>
MUDRA
</h1> 
<p align='center'>
<img src='./img/icon-large.png' >
</p>
<h4 align='center'>
A chrome extension to sync the highlighted text from web to a dropbox paper. 
</h4> 
<p align='center'><i align='center'>Take notes without leaving the tab </i></p>

### Extension Download
Download the paper extension from the [builds folder](https://github.com/chaurasia-namrata/MUDRA/blob/master/build/).

### Dropbox Connection
To connect the extension to your dropbox you need to follow these steps:

1. Login to the developer portal
    Go to the [Dropbox Developer portal](https://www.dropbox.com/developers) and log in with your Dropbox credentials.
2. Click on "Create apps"
3. Under Choose an API, select Dropbox API.
4. Under Choose the type of access you need, select App folder or Full Dropbox, depending on your needs.
5. Name your app.
6. Click Create app.

### Installation
1. Add extension to chrome with just *"Drag & Drop"* as shown here (If you are not on Windows!):
![Installation](https://user-images.githubusercontent.com/27485533/45442995-2b96cc80-b6e1-11e8-8065-b9e30943ae0b.gif)
For Windows, follow these steps:
    - Extract .crx file. (Use [7-zip](http://www.7-zip.org/))
    - Go to Chrome menu and click *Tools* then *Extensions* and toggle the *Developer Mode* ON.
    - Click on load *UNPACKED EXTENSION* and select the folder where you've extracted the extension.



### Use
- Click on the paper-extension icon and authorize.
- The extension is active now. Right-click on the selected text and you'll see the *Save to paper* option!<br>
  1. Save text to existing paper:
  ![Save to existing paper](https://user-images.githubusercontent.com/27485533/45487187-3f8f0c80-b77b-11e8-97a5-3a5c4d1018fd.gif)

  2. Save text to new paper:
  ![create paper](https://user-images.githubusercontent.com/27485533/45487333-a6acc100-b77b-11e8-9b5d-178da966b48f.gif)


### Development
1. `git clone <repository-url>` this repository.
2. Get your client_id by following the instructions [here](https://auth0.com/docs/connections/social/dropbox/ "Connect your app to Dropbox") and fill in the "*client_id_here*" placeholder in paper.js.
3. Go to Chrome menu and click *Tools* then *Extensions* and toggle the *Developer Mode* ON.
4. Click on load *UNPACKED EXTENSION* and select the folder where you've extracted the extension.
5. The extension is now installed and ready for use.

##### Open issues and PRs, feel free to contribute. If this extension helped then do star the repo and share with your friends!
