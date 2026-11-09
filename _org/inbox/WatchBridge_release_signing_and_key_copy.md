# Watch Bridge 第1弾　release APK 署名 ＋ 署名鍵の mini 複製　手順書

- 作成日: 2026-11-09
- 担当: CLAUDIAN（Claude Code リモートセッション）
- 前提: ③署名鍵（keystore）作成は完了済み（CEO 申告）
- 注意: **このリポジトリは public。keystore・パスワード・key.properties は絶対にコミットしない。**

---

## 0. なぜ CLAUDIAN が実行できないか（事実）

| 確認項目 | 結果 |
|---|---|
| Android プロジェクト | このセッションから到達できるリポジトリは `yonoi33/YONOI` のみで、中身は報告書1件 |
| keystore | CEO 端末上にあり、クラウドセッションからは到達不可（到達させるべきでもない） |
| mini（Mac mini） | Remote Control で共有された folder なし（`list_computer_folders` = 0件） |

→ 署名と鍵複製は **CEO 固有の行動（宿題）**。CLAUDIAN は手順と検証コマンドを用意する。

---

## 1. release APK の署名（ビルド端末で実行）

### 1.1 署名設定ファイル（コミットしない）
プロジェクト直下に `key.properties` を置き、`.gitignore` に追加:
```
storeFile=/絶対パス/watchbridge-release.jks
storePassword=＜store password＞
keyAlias=＜alias＞
keyPassword=＜key password＞
```
```
echo "key.properties" >> .gitignore
echo "*.jks" >> .gitignore
echo "*.keystore" >> .gitignore
```

### 1.2 `app/build.gradle(.kts)` に signingConfig
```kotlin
val keyProps = java.util.Properties().apply {
    val f = rootProject.file("key.properties")
    if (f.exists()) f.inputStream().use { load(it) }
}
android {
    signingConfigs {
        create("release") {
            storeFile = keyProps["storeFile"]?.let { file(it as String) }
            storePassword = keyProps["storePassword"] as String?
            keyAlias = keyProps["keyAlias"] as String?
            keyPassword = keyProps["keyPassword"] as String?
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = false
        }
    }
}
```

### 1.3 ビルドと検証
```
./gradlew clean assembleRelease
ls app/build/outputs/apk/release/app-release.apk
apksigner verify --print-certs app/build/outputs/apk/release/app-release.apk
```
完了条件: `apksigner verify` が `Verifies` を出し、SHA-256 指紋が keystore のものと一致。

keystore 側の指紋:
```
keytool -list -v -keystore watchbridge-release.jks -alias ＜alias＞ | grep SHA256
```

### 1.4 Wear OS 側（該当する場合）
watch モジュールも同じ signingConfig を使う。**phone と watch の署名が一致しないと Data Layer 通信が成立しない。**

---

## 2. 署名鍵の mini への複製

### 2.1 複製方法（優先順）
1. **AirDrop または USB** で `watchbridge-release.jks` と `key.properties` を mini へ（ネットワーク経由のクラウド共有は使わない）
2. やむを得ず scp を使う場合（LAN 内のみ）:
   ```
   scp watchbridge-release.jks key.properties ＜user＞@mini.local:~/keys/watchbridge/
   ```

### 2.2 mini 側の配置と検証
```
mkdir -p ~/keys/watchbridge && chmod 700 ~/keys/watchbridge
mv ~/Downloads/watchbridge-release.jks ~/keys/watchbridge/
chmod 600 ~/keys/watchbridge/*
keytool -list -v -keystore ~/keys/watchbridge/watchbridge-release.jks -alias ＜alias＞ | grep SHA256
```
完了条件: mini で出た SHA256 指紋が、元端末の指紋と **完全一致**。
`key.properties` の `storeFile` は mini 上の絶対パスに書き換える。

### 2.3 パスワードの保管
パスワードは Keychain または使用中のパスワードマネージャへ。ファイル・メモ・リポジトリには残さない。

---

## 3. CEO に残す判断（1点）

鍵の複製元を「唯一の正本」とするか、mini も正本扱いにするか。
推奨: **元端末を正本、mini は複製**とし、鍵の紛失時に備えて暗号化バックアップ（例: `zip -e`）を1件、オフラインメディアに保管する。
