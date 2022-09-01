# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


## How To Use
This has two map.
By drawing line in each map, first of all other map will be clear then two map show the same line.

### Draw line on Right map (Open Layer Map)
You can draw line in the right map by drag and drop mouse on it.
There is a Button on this map for activating drawing line. to move map you should de active drawing by click on the button or vice versa.
For removing line you must click on each line.


### Draw line on left map (Mapbox GL)
Yo can draw line by clicking on map to create a point thus line will make between points.
Also you can remove line by click on points.
You can move map by holding left click of mouse.

### Rotate in OpenLayer Map
We can rotate by clicking on deactive line then hold shift+left mouse key and rotate the map.


### Rotate in Mapbox Map
We can rotate by right click of mouse in windows or linux or hold two finger in touchpad in macOS.


## E2E Testing
For run e2e testing you should run ***yarn cypress*** then select e2e > select browser for test > select test file for visual testing. Also for headless testing you
can run ***yarn cypress:headless***

### Test Coverage
After running e2e tests, folder __coverage__ will create in the root of project.

<img height="400" src="https://i.postimg.cc/XJ89WtNk/Screen-Shot-2022-08-27-at-9-17-23-AM.png" width="400"/>


Go to coverage>lcov-report>src>index.html , then open index.html for view the test coverage summary.

<img src="https://i.postimg.cc/kGgKgwB3/Screen-Shot-2022-08-27-at-9-25-32-AM.png"/>

#### Extra information
Zoom is already active by scrolling mouse.
After changing zoom,lng and lat these data are change in location bar of window. You can copy address on paste that in new tab to take map in that position.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
