# Google Flash Cards
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

To see a live deploy of this project, visit [Google Flash Cards](https://google-flash-cards.netlify.app/).

Google Flash Cards is a multi-page application, built with the React library.

## Purpose

Google Flash Cards is a study app that utilizes the Google API to access Google Docs and store saved Flash Cards data to your Google Drive, so that you can create and use your custom study guides wherever you go.

## Features

### Google Login

* Users are able to log directly in to their Google accounts from Google Flash Cards and save Flash Cards data to their Google Drive and access their Flash Cards app saved data from anywhere in the world with an internet connection.

### Topics

* Topics house an array of quiz IDs (used to populate page with Quizzes, when Topic container is selected)

<ul>
    <li>Topics can be:<ul>
        <li>Named</li>
        <li>Assigned a representational image (default: Google Flash Cards logo)</li>
    </ul></li>
</ul>

* Each Topic is assigned a unique ID, to enable data management of Topics with the same name.

### Quizzes

* Quizzes house an array of flash card objects.

<ul>
    <li>Quizzes can be:<ul>
        <li>Named</li>
        <li>Assigned to a Topic</li>
        <li>Assigned a representational image (default: Google Flash Cards logo)</li>
        <li>Assigned flash cards</li>
    </ul></li>
</ul>

* Each quiz is assigned a unique ID, to enable data management of Quizzes with the same name.

### Flash Card

* A flash card is an object in the Quiz.cards array.

<ul>
    <li>A flash card has 3 properties:<ul>
        <li>front(string): Text data passed in by the user to represent the front side of a flash card (typically a question)</li>
        <li>back(string): Text data passed in by the user to represent the back side of a flash card (typically an answer to the question)</li>
        <li>id(integer): Sequentially assigned according to the number of flash cards currently in the Quiz.cards array</li>
    </ul></li>
</ul>

* When a user clicks on a flash card, it will flip over to reveal the other side of the card.

## App Architecture

### Logging In / Out of Google

The Google Login component from the React Google Login package is rendered with the onSuccess handler setting the result of the returned login request to the user property of the Google slice of state.

### Getting Initial Data

If the Google.user is defined, a GET request is made to Google's API at `https://www.googleapis.com/drive/v2/files` and the returned object is parsed to JSON. The returned object is then searched for an object with a title property value of `"Flash Cards app - Saved Data"` and a label property that does not evaluate to true for its trashed property (this ensures that saved data is not pulled from the trash in users drive). If those conditions are met, the matching object is returned and parsed, using a custom "parseFromGoogle" function and set to the "savedData" property of the Google slice of state.

* If those conditions are not met, a POST request is sent to `https://docs.googleapis.com/v1/documents` with a body that includes the property "title" and a value of `"Flash Cards app - Saved Data"`. A subsequent POST request is then sent to `https://docs.googleapis.com/v1/documents/${jsonResponse.documentId}:batchUpdate`, with the documentId property from the previous request's response being passed in to the URL. In the request body, a "request" of "insertText" is defined and prepares the document to be able to accept saved data. After this request, a GET request is made to `https://docs.googleapis.com/v1/documents/${jsonResponse.documentId}`, with the documentId property from the first POST request being passed in to the URL. The response from this request is parsed to JSON and added to the "savedData" property of the Google slice of state.

See referenced Google API documentation for more information about "insertText"

### Saving Data

If the Google.user is defined, and a change is made to the local Quizzes or Topics state, a POST request is sent to `https://docs.googleapis.com/v1/documents/${id}:batchUpdate` with the documentId property from the savedData property of the Google slice of state (Google.savedData.documentId) being passed in to the URL. In the request body, a "request" of "deleteContentRange" is made to delete all the old data in the document. A subsequent request is then made to `https://docs.googleapis.com/v1/documents/${id}:batchUpdate`. In the request body, a "request" of "insertText" is made to insert the new data, which has been parsed from the local Google slice of state's savedData property, to a string. After the insert request is finished, a GET request is made to `https://docs.googleapis.com/v1/documents/${id}` and the response is parsed to JSON and overwrites the local Google slice of state.

See referenced Google API documentation for more information about "deleteContentRange" and "insertText"

### Local Data

Form elements are used to handle the creation and editing of Topics and Quizzes. On submission, the local state is updated if any changes have been made, which then triggers the app to overwrite the data on the user's Google Drive.

Topics and Quizzes populate the page, based on the location of the user on the site.

* If the user is on the topics/all page, only Topics will appear.

* If a user selects a Topic, any quizzes with corresponding IDs contained in the Topic's quizIds property will be rendered below the Topic.

* If the user is on the quizzes/all page, only Quizzes will appear.

* If a user selects a Quiz, all flash cards in the Quiz object's card property array will be rendered below the topic, starting with the front side facing the user.

* If the user chooses to edit a Topic or Quiz, the aforementioned object's properties will be passed to the respective form, and the user can change any property they want to, except for the ID.

## Technologies

### Languages

<ul> 
    <li>JavaScript (ES6)
        <ul>
            <li>React</li>
            <li>React Router</li>
            <li>Redux</li>
        </ul>
    </li>
    <li>HTML</li>
    <li>CSS</li>
</ul>

### Other Packages

* react-google-login

### Testing

* Chrome Dev Tools

* Lighthouse

### Version Control

* Git

* GitHub

### Hosting & CI/CD

* GitHub

* Netlify

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.


## Testing

This project was tested manually with Chrome Dev tools on Windows 10.

Lighthouse scores as of January 8, 2023:
<ul>
    <li> Desktop 
        <ul>
            <li>Performance: 92</li>
            <li>Accessibility: 100</li>
            <li>Best Practices: 92</li>
            <li>SEO: 100</li>
        </ul>
    <li>Mobile
        <ul>
            <li>Performance: 76</li>
            <li>Accessibility: 100</li>
            <li>Best Practices: 92</li>
            <li>SEO: 100</li>
        </ul>
    </li>
</ul>

## Future Improvements

* Automated testing

* Search feature to find quizzes / topics by name

* Share feature to allow users to share / copy quizzes to other accounts.

## Contribute

If you would like to improve this project, you may submit a pull request here.

If you would like to connect with me you can reach me at:

Email: gabrielbigelow.code@gmail.com

LinkedIn: https://www.linkedin.com/in/gabriel-bigelow-b37b24232/

## References

https://reactjs.org/

https://redux.js.org/

https://www.npmjs.com/package/react-google-login

https://developers.google.com/docs/api/reference/rest

https://developers.google.com/drive/api/guides/about-sdk