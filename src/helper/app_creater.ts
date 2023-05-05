import fs from "fs";

export function archive(bundleName: string, appName: string) {
    try {
        const filePath = `/Users/jianzhi.wang/Desktop/square_studio/APP檔案/合宜家居/test_build/app/ios`
        let data = fs.readFileSync(filePath + '/HOMEE.xcodeproj/project.pbxproj', 'utf8');
        data = data
        .replace(/PRODUCT_BUNDLE_IDENTIFIER([\s\S]*?);/g, `PRODUCT_BUNDLE_IDENTIFIER = ${bundleName};`)
        .replace(/INFOPLIST_KEY_CFBundleDisplayName([\s\S]*?);/g, `INFOPLIST_KEY_CFBundleDisplayName="${appName}";`)
        const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>CFBundleAllowMixedLocalizations</key>
	<true/>
	<key>CFBundleDevelopmentRegion</key>
	<string>$(DEVELOPMENT_LANGUAGE)</string>
	<key>CFBundleDisplayName</key>
	<string>HOMEE</string>
	<key>CFBundleExecutable</key>
	<string>$(EXECUTABLE_NAME)</string>
	<key>CFBundleGetInfoString</key>
	<string></string>
	<key>CFBundleIdentifier</key>
	<string>$(PRODUCT_BUNDLE_IDENTIFIER)</string>
	<key>CFBundleInfoDictionaryVersion</key>
	<string>6.0</string>
	<key>CFBundleName</key>
	<string>$(PRODUCT_NAME)</string>
	<key>CFBundlePackageType</key>
	<string>$(PRODUCT_BUNDLE_PACKAGE_TYPE)</string>
	<key>CFBundleShortVersionString</key>
	<string>$(MARKETING_VERSION)</string>
	<key>CFBundleURLTypes</key>
	<array>
		<dict>
			<key>CFBundleIdentifier</key>
			<string></string>
			<key>CFBundleTypeRole</key>
			<string>Editor</string>
			<key>CFBundleURLSchemes</key>
			<array>
				<string>homee</string>
				<string>fb667305858194803</string>
			</array>
		</dict>
	</array>
	<key>CFBundleVersion</key>
	<string>$(CURRENT_PROJECT_VERSION)</string>
	<key>FacebookAppID</key>
	<string>667305858194803</string>
	<key>FacebookDisplayName</key>
	<string>${appName}</string>
	<key>ITSAppUsesNonExemptEncryption</key>
	<false/>
	<key>LSApplicationQueriesSchemes</key>
	<array>
		<string>fbauth2</string>
	</array>
	<key>LSRequiresIPhoneOS</key>
	<true/>
	<key>NSAppTransportSecurity</key>
	<dict>
		<key>NSAllowsArbitraryLoads</key>
		<true/>
	</dict>
	<key>NSCameraUsageDescription</key>
	<string>使用相機掃描Qrcode與場景內容</string>
	<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
	<string>取得你的位置來發布貼文</string>
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>使用定位追蹤您的場景掃描路徑</string>
	<key>UIAppFonts</key>
	<array>
		<string>NotoSansTC-Bold.otf</string>
		<string>NotoSansTC-Medium.otf</string>
		<string>NotoSansTC-Regular.otf</string>
		<string>NotoSansTC-Black.otf</string>
		<string>NotoSansTC-Light.otf</string>
		<string>NotoSansTC-Thin.otf</string>
	</array>
	<key>UIApplicationSupportsIndirectInputEvents</key>
	<true/>
	<key>UILaunchStoryboardName</key>
	<string>LaunchScreen</string>
	<key>UIRequiredDeviceCapabilities</key>
	<array>
		<string>armv7</string>
	</array>
	<key>UIStatusBarStyle</key>
	<string>UIStatusBarStyleDefault</string>
	<key>UISupportedInterfaceOrientations</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
	</array>
	<key>UISupportedInterfaceOrientations~ipad</key>
	<array>
		<string>UIInterfaceOrientationPortrait</string>
		<string>UIInterfaceOrientationPortraitUpsideDown</string>
		<string>UIInterfaceOrientationLandscapeLeft</string>
		<string>UIInterfaceOrientationLandscapeRight</string>
	</array>
	<key>UIUserInterfaceStyle</key>
	<string>Light</string>
</dict>
</plist>
    `
        fs.writeFileSync(filePath+'/HOMEE.xcodeproj/project.pbxproj', data);
        fs.writeFileSync(filePath+'/RTABMapApp/Info.plist', infoPlist);
    } catch (e) {
        console.log(e)
    }
}