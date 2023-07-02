import { MaterialIcons } from "@expo/vector-icons";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
} from "firebase/auth";
import firebase from "firebase/compat/app";
import { showMessage, hideMessage } from "react-native-flash-message";
import React, { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCollection } from "react-query-firestore";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { FormBuilder } from "react-native-paper-form-builder";
import { Colors, Fonts, Sizes } from "../../../constant/styles";
import { UserIdContext } from "../../../utils/hooks/context";

function RegisterScreen({ route, navigation }) {
  const items = route.params;
  const [userId, setUserId] = useContext(UserIdContext);
  const { add: addMail, error: errorMail } = useCollection(`mail`);
  const { control, setFocus, handleSubmit, setValue, getValues } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      type: "",
    },
    mode: "onChange",
  });

  const auth = getAuth();
  const db = firebase.app().firestore();

  
  useEffect(() => {
    setValue("type", items.type);
  }, [items]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <KeyboardAwareScrollView>
        <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />

        <View
          style={{
            flex: 1,
            paddingHorizontal: Sizes.fixPadding * 2.0,
            backgroundColor: Colors.whiteColor,
          }}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            {backArrow()}
            {registerInfo(items)}
            {items?.type === "Agent" && addRegisterForm()}
            {items?.type != "Agent" && addNonAgentForm()}
            {/* {phoneNumberTextField()} */}
            {/* {userNameTextField()} */}
            <View
              style={{ flex: 1, justifyContent: "flex-end", paddingBottom: 40 }}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.continueButtonStyle}
                onPress={(e) => {
                  handleSubmit(async (data) => {
                    const { user } = await createUserWithEmailAndPassword(
                      auth,
                      data.email ? data.email : items.email,
                      data.password
                    ).catch(function(error) {
                      // Handle Errors here.
                      var errorCode = error.code;
                      var errorMessage = error.message;
                      if (errorCode === 'auth/email-already-in-use') {
                        showMessage({
                          message: "Account with this email address exists!",
                          type: "danger",
                        })
                      } else {
                        showMessage({
                          message: errorMessage,
                          type: "danger",
                        })
                        
                      }
                      
                    });;

                    await db.collection("users").doc(user.uid).set({
                      email: user.email,
                      step: "Verification",
                      type: items.type,
                      userId: user.uid,
                    });

                    
                    await sendEmailVerification(user);

                    addMail({
                      to: user.email,
                      message: {
                        subject: "LADestate: Welcome!",
                        text: "This is the plaintext section of the email body.",
                        html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
                        <head>
                        <!--[if gte mso 9]>
                        <xml>
                          <o:OfficeDocumentSettings>
                            <o:AllowPNG/>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                          </o:OfficeDocumentSettings>
                        </xml>
                        <![endif]-->
                          <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <meta name="x-apple-disable-message-reformatting">
                          <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
                          <title></title>
                          
                            <style type="text/css">
                              @media only screen and (min-width: 570px) {
                          .u-row {
                            width: 550px !important;
                          }
                          .u-row .u-col {
                            vertical-align: top;
                          }
                        
                          .u-row .u-col-100 {
                            width: 550px !important;
                          }
                        
                        }
                        
                        @media (max-width: 570px) {
                          .u-row-container {
                            max-width: 100% !important;
                            padding-left: 0px !important;
                            padding-right: 0px !important;
                          }
                          .u-row .u-col {
                            min-width: 320px !important;
                            max-width: 100% !important;
                            display: block !important;
                          }
                          .u-row {
                            width: calc(100% - 40px) !important;
                          }
                          .u-col {
                            width: 100% !important;
                          }
                          .u-col > div {
                            margin: 0 auto;
                          }
                        }
                        body {
                          margin: 0;
                          padding: 0;
                        }
                        
                        table,
                        tr,
                        td {
                          vertical-align: top;
                          border-collapse: collapse;
                        }
                        
                        p {
                          margin: 0;
                        }
                        
                        .ie-container table,
                        .mso-container table {
                          table-layout: fixed;
                        }
                        
                        * {
                          line-height: inherit;
                        }
                        
                        a[x-apple-data-detectors='true'] {
                          color: inherit !important;
                          text-decoration: none !important;
                        }
                        
                        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 39% !important; } #u_content_image_2 .v-src-width { width: auto !important; } #u_content_image_2 .v-src-max-width { max-width: 60% !important; } #u_content_text_1 .v-container-padding-padding { padding: 30px 30px 30px 20px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 20px !important; } #u_content_button_1 .v-size-width { width: 100% !important; } #u_content_button_1 .v-text-align { text-align: left !important; } #u_content_button_1 .v-padding { padding: 15px 40px !important; } }
                            </style>
                          
                          
                        
                        <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
                        
                        </head>
                        
                        <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #fbeeb8;color: #000000">
                          <!--[if IE]><div class="ie-container"><![endif]-->
                          <!--[if mso]><div class="mso-container"><![endif]-->
                          <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #fbeeb8;width:100%" cellpadding="0" cellspacing="0">
                          <tbody>
                          <tr style="vertical-align: top">
                            <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #fbeeb8;"><![endif]-->
                            
                        
                        <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
                          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #ffffff;"><![endif]-->
                              
                        <!--[if (mso)|(IE)]><td align="center" width="550" style="width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                          <div style="height: 100%;width: 100% !important;">
                          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
                          
                        <table id="u_content_image_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:30px 10px 33px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
                              <a href="https://ladestate.com" target="_blank">
                              <img align="center" border="0" src="https://i.postimg.cc/63zDWbxp/image-5.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 265px;" width="265" class="v-src-width v-src-max-width"/>
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                          </div>
                        </div>
                        
                        
                        
                        <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
                          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #ffffff;"><![endif]-->
                              
                        <!--[if (mso)|(IE)]><td align="center" width="542" style="background-color: #5285c6;width: 542px;padding: 0px;border-top: 4px solid #ffffff;border-left: 4px solid #ffffff;border-right: 4px solid #ffffff;border-bottom: 4px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                          <div style="background-color: #5285c6;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 4px solid #ffffff;border-left: 4px solid #ffffff;border-right: 4px solid #ffffff;border-bottom: 4px solid #ffffff;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
                          
                        <table id="u_content_image_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:40px 10px 10px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                          <tr>
                            <td class="v-text-align" style="padding-right: 0px;padding-left: 0px;" align="center">
                              
                              <img align="center" border="0" src="https://i.postimg.cc/bNMfS5DG/image-4.jpg" alt="Wrong Email" title="Wrong Email" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 100%;" width="100" class="v-src-width v-src-max-width"/>
                              
                            </td>
                          </tr>
                        </table>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                          <div class="v-text-align" style="color: #333333; line-height: 140%; text-align: center; word-wrap: break-word;">
                            <p style="font-size: 14px; line-height: 140%;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;"><strong><span style="font-size: 22px; line-height: 30.8px;">Welcome OnBoard ! </span></strong></span></p>
                        <p style="font-size: 14px; line-height: 140%;"> </p>
                        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;"><span style="line-height: 19.6px; font-size: 14px;"><span style="line-height: 19.6px; font-size: 14px;">We are thrilled that you have chosen the most innovative technology in the Real Estate Business.</span></span></span></p>
                        <p style="line-height: 140%; font-size: 14px;"> </p>
                        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;"><span style="line-height: 19.6px; font-size: 14px;">We promise you to exceed your expectations as a customer, a team member, and an integral part of LADestate Fast Growing Family. </span></span></p>
                        <p style="line-height: 140%; font-size: 14px;"> </p>
                        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;"><span style="line-height: 19.6px; font-size: 14px;"><span style="line-height: 19.6px; font-size: 14px;">We wish you successful transactions, and Always Be Closing ! </span></span></span></p>
                        <p style="line-height: 140%; font-size: 14px;"> </p>
                        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;">Your BREAKTHROUGH,</span></p>
                        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: 'Open Sans', sans-serif; font-size: 14px; line-height: 19.6px; color: #ffffff;">LADestate Team</span></p>
                          </div>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <table id="u_content_button_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                        <div class="v-text-align" align="left">
                          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://ladestate.com" style="height:47px; v-text-anchor:middle; width:456px;" arcsize="6.5%"  strokecolor="#ced4d9" strokeweight="3px" fillcolor="#ffffff"><w:anchorlock/><center style="color:#5285c6;font-family:arial,helvetica,sans-serif;"><![endif]-->  
                            <a href="https://ladestate.com" target="_blank" class="v-button v-size-width" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #5285c6; background-color: #ffffff; border-radius: 3px;-webkit-border-radius: 3px; -moz-border-radius: 3px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #ced4d9; border-top-style: solid; border-top-width: 3px; border-left-color: #ced4d9; border-left-style: solid; border-left-width: 3px; border-right-color: #ced4d9; border-right-style: solid; border-right-width: 3px; border-bottom-color: #ced4d9; border-bottom-style: solid; border-bottom-width: 3px;">
                              <span class="v-padding" style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px; font-family: 'Open Sans', sans-serif;">Thank YOU</span></span>
                            </a>
                          <!--[if mso]></center></v:roundrect><![endif]-->
                        </div>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                          </div>
                        </div>
                        
                        
                        
                        <div class="u-row-container" style="padding: 0px;background-color: #ffffff">
                          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #5285c6;">
                            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: #5285c6;"><![endif]-->
                              
                        <!--[if (mso)|(IE)]><td align="center" width="550" style="background-color: #ffffff;width: 550px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                        <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
                          <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
                          
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:50px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                        <div align="center">
                          <div style="display: table; max-width:170px;">
                          <!--[if (mso)|(IE)]><table width="170" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="center"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:170px;"><tr><![endif]-->
                          
                            
                            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
                            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
                              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                <a href="https://facebook.com/" title="Facebook" target="_blank">
                                  <img src="https://i.postimg.cc/DymKZhZk/image-3.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                </a>
                              </td></tr>
                            </tbody></table>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            
                            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
                            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
                              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                <a href="https://twitter.com/" title="Twitter" target="_blank">
                                  <img src="https://i.postimg.cc/jqMbt2R4/image-2.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                </a>
                              </td></tr>
                            </tbody></table>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            
                            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                <a href="https://linkedin.com/" title="LinkedIn" target="_blank">
                                  <img src="https://i.postimg.cc/5yKd37sR/image-1.png" alt="LinkedIn" title="LinkedIn" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                </a>
                              </td></tr>
                            </tbody></table>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            
                            
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                          <tbody>
                            <tr>
                              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 0px 21px;font-family:arial,helvetica,sans-serif;" align="left">
                                
                          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 3px solid #5285c6;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                            <tbody>
                              <tr style="vertical-align: top">
                                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <span>&#160;</span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                          <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
                          </div>
                        </div>
                        <!--[if (mso)|(IE)]></td><![endif]-->
                              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                            </div>
                          </div>
                        </div>
                        
                        
                            <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                            </td>
                          </tr>
                          </tbody>
                          </table>
                          <!--[if mso]></div><![endif]-->
                          <!--[if IE]></div><![endif]-->
                        </body>
                        
                        </html>
                        `,
                      },
                    });

                    setUserId({
                      email: user.email,
                      step: "Verification",
                      type: items.type,
                      userId: user.uid,
                    });
                    
                    //await auth.currentUser.reload();
                    // await updateProfile(user, {
                    //   displayName: data.userName,
                    // });

                    // await user?.getIdTokenResult(true).then(async (token) => {
                    //   const userSaved = await add({
                    //     userId: token.claims.user_id,
                    //     email: token.claims.email,
                    //     step: "Verification",
                    //     type: items.type,
                    //   });

                    //   setUserId(userSaved[0].id);
                    // });

                    // navigation.navigate("Verification");
                  })(e);
                }}
              >
                <Text style={{ ...Fonts.whiteColor18Medium }}>Next</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );

  function addNonAgentForm() {
    return (
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                type: "password",
                name: "password",
                rules: {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                },
                textInputProps: {
                  label: "Password",
                  style: {
                    backgroundColor: "white",
                  },
                },
              },
              // {
              //   type: "password",
              //   name: "confirmPassword",

              //   rules: {
              //     required: {
              //       value: true,
              //       message: "Confirm Password is required",
              //     },
              //   },
              //   textInputProps: {
              //     label: "Confirm Password",
              //     style: {
              //       backgroundColor: "white",
              //     },
              //   },
              // },
              // {
              //   type: "text",
              //   name: "phone",

              //   rules: {
              //     required: {
              //       value: true,
              //       message: "Phone number is required",
              //     },
              //   },
              //   textInputProps: {
              //     label: "Phone Number",
              //   },
              // },
            ]}
          />
        </ScrollView>
      </View>
    );
  }

  function addRegisterForm() {
    return (
      <View style={styles.containerFormStyle}>
        <ScrollView contentContainerStyle={styles.scrollViewStyle}>
          <FormBuilder
            control={control}
            setFocus={setFocus}
            formConfigArray={[
              {
                type: "email",
                name: "email",

                rules: {
                  required: {
                    value: true,
                    message: "Email Address is required",
                  },
                },
                textInputProps: {
                  label: "Email Address",
                  style: {
                    backgroundColor: "white",
                  },
                },
              },

              {
                type: "password",
                name: "password",
                rules: {
                  required: {
                    value: true,
                    message: "Password is required",
                  },
                },
                textInputProps: {
                  label: "Password",
                  style: {
                    backgroundColor: "white",
                  },
                },
              },
              // {
              //   type: "password",
              //   name: "confirmPassword",

              //   rules: {
              //     required: {
              //       value: true,
              //       message: "Confirm Password is required",
              //     },
              //   },
              //   textInputProps: {
              //     label: "Confirm Password",
              //     style: {
              //       backgroundColor: "white",
              //     },
              //   },
              // },
              // {
              //   type: "text",
              //   name: "phone",

              //   rules: {
              //     required: {
              //       value: true,
              //       message: "Phone number is required",
              //     },
              //   },
              //   textInputProps: {
              //     label: "Phone Number",
              //   },
              // },
            ]}
          />
        </ScrollView>
      </View>
    );
  }

  function backArrow() {
    return (
      <MaterialIcons
        name="arrow-back"
        size={24}
        color={Colors.blackColor}
        style={{
          marginTop: Sizes.fixPadding * 7.0,
          marginBottom: Sizes.fixPadding,
        }}
        onPress={() => navigation.navigate("RegisterAccountType")}
      />
    );
  }

  function registerInfo(items) {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding * 1.0,
          marginBottom: Sizes.fixPadding * 2.0,
        }}
      >
        {items.type === "Agent" && (
          <Text style={{ ...Fonts.blackColor18Bold }}>Create your account</Text>
        )}

        {items.type != "Agent" && (
          <Text style={{ ...Fonts.blackColor18Bold }}>
            Welcome {items.name}!
          </Text>
        )}
        {items.type != "Agent" && (
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 10 }}>
            Email: {items.email}
          </Text>
        )}
        {items.type != "Agent" && (
          <Text style={{ ...Fonts.grayColor12Medium, fontSize: 10 }}>
            Account Type: {items.type}
          </Text>
        )}
        <Text
          style={{
            ...Fonts.grayColor12Medium,

            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          Already have an account?{" "}
          <Text
            style={{ color: Colors.primaryColor }}
            onPress={() => navigation.navigate("Login")}
          >
            Log In
          </Text>
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  phoneNumberContentStyle: {
    height: 50.0,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    borderRadius: 5,
    borderColor: Colors.blackColor,
    borderWidth: 1,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    height: 50.0,
  },
  continueButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    marginTop: Sizes.fixPadding * 3.0,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding + 5.0,
  },
});

RegisterScreen.navigationOptions = () => {
  return {
    header: () => null,
  };
};

export default RegisterScreen;
