# iGEM Software for 2021 UCAS-China

## Introduction

This year, UCAS-China have built an application *Caffeine-monitor* based on **WeChat mini-program platform**, to help our users get a better handle on their caffeine intake amount (CIA). 

The app can not only collect the coffee data detected by the hardware, but also can analyze the data and user behavior to give coffee-lovers reasonable suggestions. Three major modules have been included in our app to provide all-through functions. 

### Module 1: Collect

We collected health condition of registered users through the static form they submit and the real-time detected data of our hardware bracelets. And the coffee drinking history, including drinking time and drinking amount will be recorded in the app. A large database was created to store useful and convincing information, including smoking history, heart rate and sleep condition.

### Module 2: Analyze

In the app, we analyze the user behavior to set and adjust upper limit of CIA according to users' own conditions. The recommended CIA is calculated by original algorithm, and currently we use the model built from common people. A new way of using machine learning and Backpropagation algorithm was also built to form an auto-adaptive upgrading process of the validity of recommending CIA value.

### Module 3: Bluetooth

Bluetooth function was added to our app to transfer data to the hardware solution of our team, thus providing users a more convenient way to intake valid amount. We also decided to cooperative with major coffee sellers to provide our suggestions of coffee choice. After each time of experience, users’ feedback was collected to help our algorithm adjust arguments automatically.



## File Structure

```
.
|-- README.md               # Readme
|-- DeveloperManual.md      # Manual for Developers
|-- QRcode.jpg              # QR code to use the app
|-- cloudfunctions          # functions of cloud
|-- database_file           # database of app
|-- doc                     # report and design of app
|-- miniprogram             # Code of the App
|   |-- app.js
|   |-- app.json
|   |-- app.wxss
|   |-- components
|   |-- dist
|   |-- ec-canvas
|   |-- images 
|   |-- pages               # Source code of different pages in app
|   |   |-- about_us
|   |   |-- addFunction
|   |   |-- bluetooth
|   |   |-- chooseLib
|   |   |-- coffee_detail
|   |   |-- databaseGuide
|   |   |-- deployFunctions
|   |   |-- feedback
|   |   |-- health
|   |   |-- heartrate
|   |   |-- heartrate_guide
|   |   |-- help
|   |   |-- history
|   |   |-- home
|   |   |-- index
|   |   |-- openapi
|   |   |-- out_coffee
|   |   |-- oxygen
|   |   |-- oxygen_guide
|   |   |-- privacy_contract
|   |   |-- recommand
|   |   |-- register
|   |   |-- routine
|   |   |-- setting
|   |   |-- sleep
|   |   |-- sleep_guide
|   |   |-- storageConsole
|   |   |-- userConsole
|   |-- sitemap.json
|   |-- style
|   |   `-- guide.wxss
|   |-- utils
|   |   `-- addmul.wxs
|   |-- weui-miniprogram
|-- package-lock.json
|-- package.json
`-- project.config.json

```



## Usage

1. Using WeChat  to scan the QR code in `QRcode.jpg` 

2. Main Interface:

   The data/evaluation method is based on whether you have logged in or not to select the general standard/personalized standard, the first time you open it, you will jump to the login interface.

   You can choose not to log in to continue to use, but can not get personalized services, the first is the WeChat login, if registered jump to the main interface, if not registered, you need to jump to fill out the basic information form, and then choose whether to record the day's work and rest as the standard.

   Add coffee records, one can interact with the hardware data through Bluetooth, etc., and another can choose the coffee drunk.

3. Health:

   Connect with hardware to reflect your health through various indicators.

4. Help:

   Inside you can view the basic settings, the instructions for use and  get to know the development team

