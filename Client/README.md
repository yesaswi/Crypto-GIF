# CryptoGIF


- [Prerequisites - Mac OS](#Prerequisites)
- [Initial App Setup](#Setup)
- [Metro](#Metro)
- [Android](#Android)
- [iOS](#iOS)

## Prerequisites

### 1. Install home brew

```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"```

### 2. Install node

```brew install node```

### 3. Install watchman

```brew install watchman```

### 4. Install Xcode

Install [Xcode](https://developer.apple.com/xcode)

### 5. Install CocoaPods

```sudo gem install cocoapods```

### 6. Install Java Development Kit

```brew cask install adoptopenjdk/openjdk/adoptopenjdk8```

### 7. Install Android Studio

Install [Android Studio](https://developer.android.com/studio)

### 8. Setup Android Environment

- Type the below command in terminal</b>

    ```echo $SHELL```

- If "Bash", type the below commands one by one</b>

    ```$HOME/.bash_profile``` or ```$HOME/.bashrc.```

    ```touch ~/.bash_profile```

    ```open ~/.bash_profile```

- If "Z shell", type the below commands one by one</b>

    ```$HOME/.zshrc.```

    ```touch ~/.zshrc```

    ```open ~/.zshrc```

- In the opened Bash (or) Z file, add the below lines and save</b>

    ```export ANDROID_HOME=$HOME/Library/Android/sdk```

    ```export PATH=$PATH:$ANDROID_HOME/emulator```

    ```export PATH=$PATH:$ANDROID_HOME/tools```

    ```export PATH=$PATH:$ANDROID_HOME/tools/bin```

    ```export PATH=$PATH:$ANDROID_HOME/platform-tools```

## Setup

### 1. Clone the repsository

```git clone [repo-url].git```

- Install node modules

    ```npm install```


## Metro

### Start Metro in a new terminal and don't close it

```npx react-native start```

## Android

### Run app in android

```npx react-native run-android``` (with [Metro](#Metro) running)

## iOS

### Run app in iOS

```npx react-native run-ios``` (with [Metro](#Metro) running)
