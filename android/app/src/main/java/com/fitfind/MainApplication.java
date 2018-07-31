package com.fitfind;

import android.app.Application;
import android.util.Log;

import com.beefe.picker.PickerViewPackage;
import com.calendarevents.CalendarEventsPackage;
import com.evollu.react.fcm.FIRMessagingPackage;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.imagepicker.ImagePickerPackage;
import com.psykar.cookiemanager.CookieManagerPackage;
import com.audioStreaming.ReactNativeAudioStreamingPackage;
import java.util.Arrays;
import java.util.List;


import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;

public class MainApplication extends Application implements ReactApplication {
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new CookieManagerPackage(),
          new ReactNativeAudioStreamingPackage(),
          new PickerViewPackage(),
          new ImagePickerPackage(),
          new FIRMessagingPackage(),
          new CalendarEventsPackage(),
          new FBSDKPackage(mCallbackManager)
      );
    }
  };

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.sdkInitialize(getApplicationContext());
    AppEventsLogger.activateApp(this);
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
