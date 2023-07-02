import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { getAuth } from "firebase/auth";
import { showMessage, hideMessage } from "react-native-flash-message";
import { PDFDocument, StandardFonts } from "pdf-lib";
import RNShareFile from 'react-native-share-pdf';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TransitionPresets } from "react-navigation-stack";
import { useCollection, useDocument } from "react-query-firestore";
import PDFReader from "rn-pdf-reader-js";
import ShortUniqueId from "short-unique-id";
import Contract from "../../assets/pdf/ejari";
import { Colors, Fonts, Sizes } from "../../constant/styles";
import { ContractContext } from "../../utils/hooks/context";
const { width, height } = Dimensions.get("screen");

function ViewContractScreen({ route, navigation }) {
  const auth = getAuth();
  const userAuth = auth.currentUser;
  const { data: user } = useDocument(
    userAuth ? `users/${userAuth.uid}` : undefined
  );
  const { data: usersData,  error: userError } = useCollection(`users`);
  const { add: addMail, error: errorMail } = useCollection(`mail`);
  const [state, setState] = useState();
  const sheetRef = useRef();
  const { add } = useCollection("mail");
  const snapPoints = useMemo(() => ["40%", "70%"], []);

  function get(url) {
    return new Promise((accept, reject) => {
      var req = new XMLHttpRequest();
      req.open("GET", url, true);
      req.responseType = "arraybuffer";

      req.onload = function (event) {
        var resp = req.response;
        if (resp) {
          accept(resp);
        }
      };

      req.send(null);
    });
  }

  const handleSnapPress = useCallback((index) => {
    sheetRef.current.snapToIndex(index);
  }, []);

  const [item, setContract] = useContext(ContractContext);
  const { deleteDocument, update } = useDocument(
    item?.id ? `contracts/${item?.id}` : undefined
  );

  useEffect(() => {
    const fetchData = async (item) => {
      // const existingPdfBytes = await get(
      //   "https://dubailand.gov.ae/media/nijhtrss/ejari_unified_tenancy_contract_v3.pdf"
      // );
      // const existingPdfBytes = await fetch(url).then((res) =>
      //   res.arrayBuffer()
      // );

      

      const pdfDoc = await PDFDocument.load(Contract);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];
      const secondPage = pages[1];
      const { width, height } = firstPage.getSize();

      //Date
      firstPage.drawText(
        item?.contractDate ? new Date(item?.contractDate).toDateString() : "",
        {
          x: 45,
          y: height / 2 + 352,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //Owners INFO Name ---------------------------
      firstPage.drawText(item.ownerName ? item.ownerName : "", {
        x: 85,
        y: height / 2 + 295,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Lessors Name
      firstPage.drawText(item.landlordName ? item.landlordName : "", {
        x: 85,
        y: height / 2 + 275,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Emirates ID
      firstPage.drawText(
        item.landlordEmiratesId ? item.landlordEmiratesId : "",
        {
          x: 105,
          y: height / 2 + 250,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //License No
      firstPage.drawText(
        item.landlordBusinessLicenseNo ? item.landlordBusinessLicenseNo : "",
        {
          x: 85,
          y: height / 2 + 230,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //Licenceing Auth
      firstPage.drawText(
        item.landlordBusinessLicenseAuth
          ? item.landlordBusinessLicenseAuth
          : "",
        {
          x: 385,
          y: height / 2 + 230,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //Lessors Email
      firstPage.drawText(item.landlordEmail ? item.landlordEmail : "", {
        x: 85,
        y: height / 2 + 200,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Lessors Phone
      firstPage.drawText(item.landlordPhone ? item.landlordPhone : "", {
        x: 85,
        y: height / 2 + 180,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //------ TENANT---------

      //Lessors Name
      firstPage.drawText(item.tenantName ? item.tenantName : "", {
        x: 85,
        y: height / 2 + 130,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Emirates ID
      firstPage.drawText(item.tenantEmiratesId ? item.tenantEmiratesId : "", {
        x: 105,
        y: height / 2 + 108,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //License No
      firstPage.drawText(
        item.tenantBusinessLicenseNo ? item.tenantBusinessLicenseNo : "",
        {
          x: 85,
          y: height / 2 + 88,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //Licenceing Auth
      firstPage.drawText(
        item.tenantBusinessLicenseAuth ? item.tenantBusinessLicenseAuth : "",
        {
          x: 385,
          y: height / 2 + 88,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        }
      );

      //Lessors Email
      firstPage.drawText(item.tenantEmail ? item.tenantEmail : "", {
        x: 85,
        y: height / 2 + 64,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Lessors Phone
      firstPage.drawText(item.tenantPhone ? item.tenantPhone : "", {
        x: 85,
        y: height / 2 + 42,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //------PROPERTY INFO

      //Property Usage ID
      firstPage.drawText("X", {
        x: 371,
        y: height / 2 - 11,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Plot No
      firstPage.drawText(item.PlotNo ? item.PlotNo : "", {
        x: 85,
        y: height / 2 - 32,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Building Name
      firstPage.drawText(item.PropertyName ? item.PropertyName : "", {
        x: 85,
        y: height / 2 - 52,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Property Type
      firstPage.drawText(item.PropertyType ? item.PropertyType : "", {
        x: 85,
        y: height / 2 - 75,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Location
      firstPage.drawText(item.PropertyAddress ? item.PropertyAddress : "", {
        x: 85,
        y: height / 2 - 98,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Makani No
      firstPage.drawText(item.MakaniNo ? item.MakaniNo : "", {
        x: 369,
        y: height / 2 - 32,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Property No
      firstPage.drawText(item.PropertyNo ? item.PropertyNo : "", {
        x: 369,
        y: height / 2 - 52,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Property Area (sm)
      firstPage.drawText(item.Size ? item.Size : "", {
        x: 383,
        y: height / 2 - 75,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Premise No (DEWA)

      firstPage.drawText(item.DewaNo ? item.DewaNo : "", {
        x: 385,
        y: height / 2 - 100,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      // ------ CONTRACT INFO --------

      //Contract Period from
      firstPage.drawText(item.dateFrom ? item.dateFrom : "", {
        x: 85,
        y: height / 2 - 150,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      // Contract to
      firstPage.drawText(item.dateTo ? item.dateTo : "", {
        x: 170,
        y: height / 2 - 150,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Annual Rent
      firstPage.drawText(item.annualRent ? item.annualRent : "", {
        x: 85,
        y: height / 2 - 177,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Mode of Payment
      firstPage.drawText(item.modePayment ? item.modePayment : "", {
        x: 92,
        y: height / 2 - 199,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Contract Value
      firstPage.drawText(item.contractValue ? item.contractValue : "", {
        x: 369,
        y: height / 2 - 150,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      //Security Deposit Amount

      firstPage.drawText(item.securityDeposit ? item.securityDeposit : "", {
        x: 394,
        y: height / 2 - 178,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      secondPage.drawText(item.additional1 ? item.additional1 : "", {
        x: 40,
        y: height / 2 - 148,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      secondPage.drawText(item.additional2 ? item.additional2 : "", {
        x: 40,
        y: height / 2 - 170,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      secondPage.drawText(item.additional3 ? item.additional3 : "", {
        x: 40,
        y: height / 2 - 193,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      secondPage.drawText(item.additional4 ? item.additional4 : "", {
        x: 40,
        y: height / 2 - 217,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      secondPage.drawText(item.additional5 ? item.additional5 : "", {
        x: 40,
        y: height / 2 - 237,
        size: 10,
        font: helveticaFont,
        // color: rgb(0.95, 0.1, 0.1),
        // rotate: degrees(-45),
      });

      // --- SIGNATURES ------
      if (item.TenantSignature) {
        const pngImage = await pdfDoc.embedPng(item.TenantSignature);
        const pngDims = pngImage.scale(0.08);
        //Tenant Signature
        firstPage.drawImage(pngImage, {
          x: 62, // firstPage.getWidth() / 2 - 150,
          y: height / 2 - 408, //  - pngDims.height,
          width: pngDims.width,
          height: pngDims.height,
        });
        secondPage.drawImage(pngImage, {
          x: 62, // firstPage.getWidth() / 2 - 150,
          y: height / 2 - 378, //  - pngDims.height,
          width: pngDims.width,
          height: pngDims.height,
        });

        firstPage.drawText(item.TenantSignDate ? item.TenantSignDate : "", {
          x: 180,
          y: height / 2 - 408,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        });

        secondPage.drawText(item.TenantSignDate ? item.TenantSignDate : "", {
          x: 181,
          y: height / 2 - 371,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        });
      }

      if (item.LandlordSignature) {
        const pngImage = await pdfDoc.embedPng(item.LandlordSignature);
        const pngDims = pngImage.scale(0.08);
        //Tenant Signature
        firstPage.drawImage(pngImage, {
          x: 400, // firstPage.getWidth() / 2 - 150,
          y: height / 2 - 408, //  - pngDims.height,
          width: pngDims.width,
          height: pngDims.height,
        });
        secondPage.drawImage(pngImage, {
          x: 400, // firstPage.getWidth() / 2 - 150,
          y: height / 2 - 378, //  - pngDims.height,
          width: pngDims.width,
          height: pngDims.height,
        });

        firstPage.drawText(item.LandlordSignDate ? item.LandlordSignDate : "", {
          x: 480,
          y: height / 2 - 408,
          size: 10,
          font: helveticaFont,
          // color: rgb(0.95, 0.1, 0.1),
          // rotate: degrees(-45),
        });

        secondPage.drawText(
          item.LandlordSignDate ? item.LandlordSignDate : "",
          {
            x: 481,
            y: height / 2 - 371,
            size: 10,
            font: helveticaFont,
            // color: rgb(0.95, 0.1, 0.1),
            // rotate: degrees(-45),
          }
        );
      }

      //    //Security Deposit Amount
      //   firstPage.drawText("Abbas Carmody", {
      //     x: 85,
      //     y: height / 2 + 295,
      //     size: 15,
      //     font: helveticaFont,
      //     // color: rgb(0.95, 0.1, 0.1),
      //     // rotate: degrees(-45),
      //   });

      //    //Security Deposit Amount
      //   firstPage.drawText("Abbas Carmody", {
      //     x: 85,
      //     y: height / 2 + 295,
      //     size: 15,
      //     font: helveticaFont,
      //     // color: rgb(0.95, 0.1, 0.1),
      //     // rotate: degrees(-45),
      //   });

      //  //Security Deposit Amount
      //   firstPage.drawText("Abbas Carmody", {
      //     x: 85,
      //     y: height / 2 + 295,
      //     size: 15,
      //     font: helveticaFont,
      //     // color: rgb(0.95, 0.1, 0.1),
      //     // rotate: degrees(-45),
      //   });

      const pdfBytes = await pdfDoc.saveAsBase64({ dataUri: true });

      setState(pdfBytes);
    };

    fetchData(item);
  }, []);

  function pdfView() {
    return (
      <>
        <PDFReader
          source={{
            base64: state,
          }}
        ></PDFReader>
      </>
    );
  }
  async function handleDownload(){
    
    const showError = await RNShareFile.sharePDF(state.replace("data:application/pdf;base64,",""), "contract-1.pdf");
    if (showError) {
      showMessage({
        message: "An issue occured!",
        type: "danger",
      })
      // Do something with the error
    }
  
  }
  function addActionButtons(item) {
    return (
      <View style={styles.buyAndRentButtonContainerStyle}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("BottomBar")}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: Colors.whiteColor,
            borderColor: null,
            borderWidth: 0.0,
          }}
        >
          <MaterialIcons
            name="home"
            size={24}
            color={Colors.primaryColor}
          ></MaterialIcons>
        </TouchableOpacity>
        {user?.type === "Agent" && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => deleteDocument()}
            style={{
              ...styles.buyAndRentButtonStyle,
              backgroundColor: Colors.whiteColor,
              borderColor: null,
              borderWidth: 0.0,
            }}
          >
            <MaterialIcons
              name="delete"
              size={24}
              color={Colors.primaryColor}
            ></MaterialIcons>
          </TouchableOpacity>
        )}
        {user.type === "Agent" && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("AddNewProperty")}
            style={{
              ...styles.buyAndRentButtonStyle,
              backgroundColor: Colors.whiteColor,
              borderColor: null,
              borderWidth: 0.0,
            }}
          >
            <MaterialIcons
              name="edit"
              size={24}
              color={Colors.primaryColor}
            ></MaterialIcons>
          </TouchableOpacity>
        )}

<TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleSnapPress(0)}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: Colors.whiteColor,
            borderColor: null,
            borderWidth: 0.0,
          }}
        >
          <MaterialIcons
            name="grading"
            size={24}
            color={Colors.primaryColor}
          ></MaterialIcons>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => handleDownload()}
          style={{
            ...styles.buyAndRentButtonStyle,
            backgroundColor: Colors.whiteColor,
            borderColor: null,
            borderWidth: 0.0,
          }}
        >
          <MaterialIcons
            name="file-download"
            size={24}
            color={Colors.primaryColor}
          ></MaterialIcons>
        </TouchableOpacity>
        {user.type != "Agent" && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.navigate("Signature")}
            style={{
              ...styles.buyAndRentButtonStyle,
              backgroundColor: Colors.primaryColor,
              borderColor: Colors.primaryColor,
              borderWidth: 0.0,
            }}
          >
            <MaterialIcons
              name="create"
              size={24}
              color={Colors.whiteColor}
            ></MaterialIcons>
          </TouchableOpacity>
        )}
        {user.type === "Agent" && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => emailClient(item)}
            style={{
              ...styles.buyAndRentButtonStyle,
              backgroundColor: Colors.primaryColor,
              borderColor: Colors.primaryColor,
              borderWidth: 0.0,
            }}
          >
            <MaterialIcons
              name="email"
              size={24}
              color={Colors.whiteColor}
            ></MaterialIcons>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  function title({ title }) {
    return (
      <Text
        style={{
          ...Fonts.blackColor18Bold,
          marginHorizontal: Sizes.fixPadding * 2.0,
          marginTop: Sizes.fixPadding,
        }}
      >
        {title}
      </Text>
    );
  }

  async function emailClient(item) {
    const uidTenant = new ShortUniqueId({ length: 10 })();
    const uidLandlord = new ShortUniqueId({ length: 10 })();

    update({ tenantUUID: uidTenant, landlordUUID: uidLandlord });

    if (await usersData.filter(x => x.email === item.tenantEmail & x.type === "Tenant").length > 0) {

      addMail({
        to: item.tenantEmail,
        message: {
          subject: "LADestate: A new contract has been sent to you!",
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
          
          table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 55% !important; } #u_content_text_1 .v-container-padding-padding { padding: 30px 30px 30px 20px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 20px !important; } #u_content_button_1 .v-size-width { width: 100% !important; } #u_content_button_1 .v-text-align { text-align: left !important; } #u_content_button_1 .v-padding { padding: 15px 40px !important; } }
              </style>
            
            
          
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
                <img align="center" border="0" src="https://i.postimg.cc/63zDWbxp/image-5.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 265px;" width="265" class="v-src-width v-src-max-width" /> </a>
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
                
          <!--[if (mso)|(IE)]><td align="center" width="542" style="background-color: #ffffff;width: 542px;padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
            
          <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                  
            <div class="v-text-align" style="color: #5285c6; line-height: 140%; text-align: left; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><span style="font-family: arial, helvetica, sans-serif; font-size: 20px; line-height: 28px;"><span style="line-height: 28px; font-size: 20px;">Welcome Home,</span></span></p>
          <p style="font-size: 14px; line-height: 140%;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Your rental agreement is ready for your signature.</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Please login to your account, review your agreement and sign It. </span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">Welcome Home</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">LADestate Team</span></span></p>
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
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
                
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
                    <img src="https://i.postimg.cc/jqMbt2R4/image-2.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                  </a>
                </td></tr>
              </tbody></table>
              <!--[if (mso)|(IE)]></td><![endif]-->
              
              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
                <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <a href="https://twitter.com/" title="Twitter" target="_blank">
                    <img src="https://i.postimg.cc/DymKZhZk/image-3.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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
    } else {
      addMail({
        to: item.tenantEmail,
        message: {
          subject: "LADestate: You have been requested to sign a contract.",
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
          
          table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 55% !important; } #u_content_text_1 .v-container-padding-padding { padding: 30px 30px 30px 20px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 20px !important; } #u_content_button_1 .v-size-width { width: 100% !important; } #u_content_button_1 .v-text-align { text-align: left !important; } #u_content_button_1 .v-padding { padding: 15px 40px !important; } }
              </style>
            
            
          
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
                
          <!--[if (mso)|(IE)]><td align="center" width="542" style="background-color: #ffffff;width: 542px;padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
            
          <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                  
            <div class="v-text-align" style="color: #5285c6; line-height: 140%; text-align: left; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><span style="font-family: arial, helvetica, sans-serif; font-size: 20px; line-height: 28px;"><span style="line-height: 28px; font-size: 20px;">Welcome Home,</span></span></p>
          <p style="font-size: 14px; line-height: 140%;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Your rental agreement is ready for your signature.</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Please click on this Link, download the app, review your agreement and sign It. </span></span></p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Alternatively use the reference code to sign up: ${uidTenant}. </span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">Welcome Home</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">LADestate Team</span></span></p>
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
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://ladestate.com" style="height:47px; v-text-anchor:middle; width:456px;" arcsize="6.5%"  strokecolor="#ced4d9" strokeweight="3px" fillcolor="#5285c6"><w:anchorlock/><center style="color:#ffffff;font-family:arial,helvetica,sans-serif;"><![endif]-->  
              <a href="https://rnladestate.page.link/register?id=${item.tenantEmail}&name=${item.tenantName.replaceAll(" ","%20")}&type=Tenant" target="_blank" class="v-button v-size-width" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #5285c6; border-radius: 3px;-webkit-border-radius: 3px; -moz-border-radius: 3px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #ced4d9; border-top-style: solid; border-top-width: 3px; border-left-color: #ced4d9; border-left-style: solid; border-left-width: 3px; border-right-color: #ced4d9; border-right-style: solid; border-right-width: 3px; border-bottom-color: #ced4d9; border-bottom-style: solid; border-bottom-width: 3px;">
                <span class="v-padding" style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px; font-family: arial, helvetica, sans-serif;">C L I C K   H E R E</span></span>
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
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
                
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
                    <img src="https://i.postimg.cc/jqMbt2R4/image-2.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                  </a>
                </td></tr>
              </tbody></table>
              <!--[if (mso)|(IE)]></td><![endif]-->
              
              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
                <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <a href="https://twitter.com/" title="Twitter" target="_blank">
                    <img src="https://i.postimg.cc/DymKZhZk/image-3.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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

    }

    
    if (await usersData.filter(x => x.email === item.landlordEmail & x.type === "Landlord").length > 0) {

      addMail({
        to: item.landlordEmail,
        message: {
          subject: "LADestate: A new contract has been sent to you!",
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
          
          table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 55% !important; } #u_content_text_1 .v-container-padding-padding { padding: 30px 30px 30px 20px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 20px !important; } #u_content_button_1 .v-size-width { width: 100% !important; } #u_content_button_1 .v-text-align { text-align: left !important; } #u_content_button_1 .v-padding { padding: 15px 40px !important; } }
              </style>
            
            
          
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
                <img align="center" border="0" src="https://i.postimg.cc/63zDWbxp/image-5.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 265px;" width="265" class="v-src-width v-src-max-width"/> </a>
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
                
          <!--[if (mso)|(IE)]><td align="center" width="542" style="background-color: #ffffff;width: 542px;padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
          <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
            <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
            <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
            
          <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
            <tbody>
              <tr>
                <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                  
            <div class="v-text-align" style="color: #5285c6; line-height: 140%; text-align: left; word-wrap: break-word;">
              <p style="font-size: 14px; line-height: 140%;"><span style="font-family: arial, helvetica, sans-serif; font-size: 20px; line-height: 28px;"><span style="line-height: 28px; font-size: 20px;">Welcome Home,</span></span></p>
          <p style="font-size: 14px; line-height: 140%;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Your rental agreement is ready for your signature.</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Please login to your account, review your agreement and sign It. </span></span></p>
          <p style="line-height: 140%; font-size: 14px;"> </p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">Welcome Home</span></span></p>
          <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">LADestate Team</span></span></p>
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
            <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
              <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
                
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
                    <img src="https://i.postimg.cc/jqMbt2R4/image-2.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                  </a>
                </td></tr>
              </tbody></table>
              <!--[if (mso)|(IE)]></td><![endif]-->
              
              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
                <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                  <a href="https://twitter.com/" title="Twitter" target="_blank">
                    <img src="https://i.postimg.cc/DymKZhZk/image-3.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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
          
          </html>`,
        },
      });
    } else {
    addMail({
      to: item.landlordEmail,
      message: {
        subject: "LADestate: You have been requested to sign a contract.",
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
        
        table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_1 .v-src-width { width: auto !important; } #u_content_image_1 .v-src-max-width { max-width: 55% !important; } #u_content_text_1 .v-container-padding-padding { padding: 30px 30px 30px 20px !important; } #u_content_button_1 .v-container-padding-padding { padding: 10px 20px !important; } #u_content_button_1 .v-size-width { width: 100% !important; } #u_content_button_1 .v-text-align { text-align: left !important; } #u_content_button_1 .v-padding { padding: 15px 40px !important; } }
            </style>
          
          
        
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
              <img align="center" border="0" src="https://i.postimg.cc/63zDWbxp/image-5.png" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 50%;max-width: 265px;" width="265" class="v-src-width v-src-max-width"/> </a>
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
              
        <!--[if (mso)|(IE)]><td align="center" width="542" style="background-color: #ffffff;width: 542px;padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
        <div class="u-col u-col-100" style="max-width: 320px;min-width: 550px;display: table-cell;vertical-align: top;">
          <div style="background-color: #ffffff;height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
          <!--[if (!mso)&(!IE)]><!--><div style="height: 100%; padding: 0px;border-top: 4px solid #d9d8d8;border-left: 4px solid #d9d8d8;border-right: 4px solid #d9d8d8;border-bottom: 4px solid #d9d8d8;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
          
        <table id="u_content_text_1" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
          <tbody>
            <tr>
              <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 30px 30px 40px;font-family:arial,helvetica,sans-serif;" align="left">
                
          <div class="v-text-align" style="color: #5285c6; line-height: 140%; text-align: left; word-wrap: break-word;">
            <p style="font-size: 14px; line-height: 140%;"><span style="font-family: arial, helvetica, sans-serif; font-size: 20px; line-height: 28px;"><span style="line-height: 28px; font-size: 20px;">Welcome Home,</span></span></p>
        <p style="font-size: 14px; line-height: 140%;"> </p>
        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Your rental agreement is ready for your signature.</span></span></p>
        <p style="line-height: 140%; font-size: 14px;"> </p>
        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Please click on this Link, download the app, review your agreement and sign It. </span></span></p>
        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 16px; line-height: 22.4px;"><span style="line-height: 22.4px; font-size: 16px;">Alternatively use the reference code to sign up: ${uidLandlord}. </span></span></p>
        <p style="line-height: 140%; font-size: 14px;"> </p>
        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">Welcome Home</span></span></p>
        <p style="line-height: 140%; font-size: 14px;"><span style="font-family: arial, helvetica, sans-serif; font-size: 18px; line-height: 25.2px;"><span style="line-height: 25.2px; font-size: 18px;">LADestate Team</span></span></p>
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
          <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://ladestate.com" style="height:47px; v-text-anchor:middle; width:456px;" arcsize="6.5%"  strokecolor="#ced4d9" strokeweight="3px" fillcolor="#5285c6"><w:anchorlock/><center style="color:#ffffff;font-family:arial,helvetica,sans-serif;"><![endif]-->  
            <a href="https://rnladestate.page.link/register?id=${item.landlordEmail}&name=${item.landlordName.replaceAll(" ","%20")}&type=Landlord" target="_blank" class="v-button v-size-width" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #ffffff; background-color: #5285c6; border-radius: 3px;-webkit-border-radius: 3px; -moz-border-radius: 3px; width:100%; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;border-top-color: #ced4d9; border-top-style: solid; border-top-width: 3px; border-left-color: #ced4d9; border-left-style: solid; border-left-width: 3px; border-right-color: #ced4d9; border-right-style: solid; border-right-width: 3px; border-bottom-color: #ced4d9; border-bottom-style: solid; border-bottom-width: 3px;">
              <span class="v-padding" style="display:block;padding:15px 40px;line-height:120%;"><span style="font-size: 14px; line-height: 16.8px; font-family: arial, helvetica, sans-serif;">C L I C K   H E R E</span></span>
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
          <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 550px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
            <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: #ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:550px;"><tr style="background-color: transparent;"><![endif]-->
              
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
                  <img src="https://i.postimg.cc/jqMbt2R4/image-2.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                </a>
              </td></tr>
            </tbody></table>
            <!--[if (mso)|(IE)]></td><![endif]-->
            
            <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 25px;" valign="top"><![endif]-->
            <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 25px">
              <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                <a href="https://twitter.com/" title="Twitter" target="_blank">
                  <img src="https://i.postimg.cc/DymKZhZk/image-3.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
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
        
        </html>`,
      },
    })}
  
    showMessage({
      message: "Tenant & Landlord request has been sent!",
      type: "success",
    })
  }

  function header() {
    return (
      <View style={styles.headerContentStyle}>
        <MaterialIcons
          name="arrow-back"
          size={24}
          color="black"
          onPress={() => navigation.goBack()}
          style={{ position: "absolute", left: 20.0 }}
        />
        <Text
          style={{
            ...Fonts.blackColor18Bold,
            alignSelf: "center",
            justifyContent: "center",
          }}
        >
          Tenancy Contract
        </Text>
      </View>
    );
  }
  function bottomSheet() {
    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        animateOnMount
        enableOverDrag={false}
      >
        <BottomSheetView style={{ padding: Sizes.fixPadding * 2 }}>
          {!item?.contractDate && (
            <Text style={{ color: Colors.secondaryColor }}>
              Missing Contract Date!
            </Text>
          )}
          <Text style={{ fontWeight: "bold" }}>Landlord Details</Text>
          {!item?.ownerName && (
            <Text style={{ color: Colors.secondaryColor }}>
              Missing Owners Name
            </Text>
          )}
          {!item.landlordName && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord Name{" "}
            </Text>
          )}
          {!item.landlordEmiratesId && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord EmiratesId{" "}
            </Text>
          )}

          {!item.landlordBusinessLicenseNo && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord BusinessLicense No
            </Text>
          )}

          {!item.landlordBusinessLicenseAuth && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord Business License Auth
            </Text>
          )}
          {!item.landlordEmail && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord Email{" "}
            </Text>
          )}
          {!item.landlordPhone && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord Phone{" "}
            </Text>
          )}
          <Text style={{ fontWeight: "bold" }}>Tenant Details</Text>
          {!item.tenantName && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Name{" "}
            </Text>
          )}
          {!item.tenantEmiratesId && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Emirates Id{" "}
            </Text>
          )}

          {!item.tenantBusinessLicenseNo && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Business License No{" "}
            </Text>
          )}

          {!item.tenantBusinessLicenseAuth && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Business License Auth
            </Text>
          )}
          {!item.tenantEmail && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Email{" "}
            </Text>
          )}
          {!item.tenantPhone && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Phone{" "}
            </Text>
          )}
          {!item.PropertyUsage && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Property Usage{" "}
            </Text>
          )}
          {!item.PlotNo && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Plot No{" "}
            </Text>
          )}
          {!item.PropertyName && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Property Name{" "}
            </Text>
          )}
          {!item.PropertyType && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Property Type{" "}
            </Text>
          )}
          {!item.PropertyAddress && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Property Address{" "}
            </Text>
          )}
          {!item.MakaniNo && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Makani No{" "}
            </Text>
          )}
          {!item.PropertyNo && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Property No{" "}
            </Text>
          )}
          {!item.Size && (
            <Text style={{ color: Colors.secondaryColor }}> Missing Size </Text>
          )}
          {!item.DewaNo && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Dewa No{" "}
            </Text>
          )}
          <Text style={{ fontWeight: "bold" }}>Contract Info</Text>

          {!item.dateFrom && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Date From{" "}
            </Text>
          )}

          {!item.dateTo && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Date To{" "}
            </Text>
          )}
          {!item.annualRent && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Annual Rent{" "}
            </Text>
          )}
          {!item.modePayment && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Mode of Payment{" "}
            </Text>
          )}
          {!item.contractValue && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Contract Value{" "}
            </Text>
          )}
          {!item.securityDeposit && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Security Deposit{" "}
            </Text>
          )}
          {!item.additional1 && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Additional1{" "}
            </Text>
          )}
          {!item.additional2 && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Additional2{" "}
            </Text>
          )}
          {!item.additional3 && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Additional3{" "}
            </Text>
          )}
          {!item.additional4 && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Additional4{" "}
            </Text>
          )}
          {!item.additional5 && (
            <Text style={{ color: Colors.blackColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Additional5{" "}
            </Text>
          )}
          <Text style={{ fontWeight: "bold" }}>Signatures</Text>
          {!item.TenantSignature && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Tenant Signature{" "}
            </Text>
          )}
          {!item.LandlordSignature && (
            <Text style={{ color: Colors.secondaryColor }}>
              {" "}
              <MaterialIcons
                name="warning"
                size={15}
                color={Colors.primaryColor}
              ></MaterialIcons>
              Missing Landlord Signature{" "}
            </Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      {header()}
      {state && pdfView()}
      {state && addActionButtons(item)}
      {bottomSheet()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buyAndRentButtonContainerStyle: {
    marginHorizontal: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: Sizes.fixPadding * 2.0,
  },
  buyAndRentButtonStyle: {
    flex: 0.47,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding - 3.0,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: Sizes.fixPadding,
  },
  propertyDetails: { color: Colors.blackColor },
  headerContentStyle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 60.0,
    backgroundColor: Colors.whiteColor,
    paddingHorizontal: Sizes.fixPadding * 2.0,
    // elevation: 10.0,
  },
  textFieldStyle: {
    ...Fonts.blackColor14Medium,
    marginHorizontal: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.whiteColor,
    marginVertical: Sizes.fixPadding - 3.0,
    height: 50.0,
  },
  buyOrRentUnselectedStyle: {
    height: 20.0,
    width: 20.0,
    borderRadius: 10.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    justifyContent: "center",
  },
  featuredPropertyImageStyle: {
    height: 80,
    width: 80,
    borderRadius: 10,
  },
  propertyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 10,
    padding: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    marginVertical: Sizes.fixPadding * 0.5,
  },
  buyOrRentSelectedStyle: {
    width: 14.0,
    height: 14.0,
    borderRadius: 7.0,
    backgroundColor: Colors.primaryColor,
  },
  addNewListingButtonStyle: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Sizes.fixPadding,
    position: "absolute",
    bottom: 0.0,
    left: 0.0,
    right: 0.0,
  },
  addPhotoContentStyle: {
    width: 100.0,
    height: 100.0,
    borderRadius: 50.0,
    borderColor: Colors.primaryColor,
    borderWidth: 1.0,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding,
  },
  bottomSheetContentStyle: {
    backgroundColor: Colors.whiteColor,
    paddingTop: Sizes.fixPadding + 5.0,
    paddingBottom: Sizes.fixPadding,
  },
});

ViewContractScreen.navigationOptions = () => {
  return {
    header: () => null,
    ...TransitionPresets.SlideFromRightIOS,
  };
};

export default ViewContractScreen;
