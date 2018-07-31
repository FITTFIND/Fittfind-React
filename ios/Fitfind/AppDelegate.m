/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RNFIRMessaging.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <Bolts/BFURL.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  NSURL *jsCodeLocation;

  jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true&minify=false"];
  NSLog(@"jsCodeLocation%@", jsCodeLocation);
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"Fitfind"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  [FIRApp configure];
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self];
  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  return YES;
}
- (void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions))completionHandler
{
   [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:notification.request.content.userInfo];
     if([[notification.request.content.userInfo valueForKey:@"show_in_foreground"] isEqual:@YES]){
     completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge | UNNotificationPresentationOptionSound);
   }else{
     completionHandler(UNNotificationPresentationOptionNone);
   }
 }

- (void)userNotificationCenter:(UNUserNotificationCenter *)center didReceiveNotificationResponse:(UNNotificationResponse *)response withCompletionHandler:(void (^)())completionHandler
{
  NSDictionary* userInfo = [[NSMutableDictionary alloc] initWithDictionary: response.notification.request.content.userInfo];
   [userInfo setValue:@YES forKey:@"opened_from_tray"];
  [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:userInfo];
}
//You can skip this method if you don't want to use local notification
-(void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
 [[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:notification.userInfo];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
[[NSNotificationCenter defaultCenter] postNotificationName:FCMNotificationReceived object:self userInfo:userInfo];
   completionHandler(UIBackgroundFetchResultNoData);
 }
- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  BOOL handled = [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url sourceApplication:options[UIApplicationOpenURLOptionsSourceApplicationKey] annotation:options[UIApplicationOpenURLOptionsAnnotationKey]];
  return handled;
}
- (void)applicationDidBecomeActive:(UIApplication *)application {
  [FBSDKAppEvents activateApp];
}
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  BFURL *parsedUrl = [BFURL URLWithInboundURL:url sourceApplication:sourceApplication];
  if ([parsedUrl appLinkData]) {
    NSURL *targetUrl = [parsedUrl targetURL];
    [[[UIAlertView alloc] initWithTitle:@"Received link:" message:[targetUrl absoluteString] delegate:nil cancelButtonTitle:@"Ok" otherButtonTitles:nil, nil] show];
    return TRUE;
  }
  return FALSE;
}
@end
