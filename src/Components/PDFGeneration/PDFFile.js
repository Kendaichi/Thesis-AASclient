import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Times-Roman",
  },
  image: {
    marginVertical: 15,
    marginHorizontal: 100,
  },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "center",
    color: "grey",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 50,
    textAlign: "right",
    color: "grey",
  },
  headerBox: {
    border: "1 solid black",
    display: "flex",
    margin: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#007bff",
  },
  innerBox: {
    borderRight: "1 solid black",
    paddingRight: 10,
    padding: 10,
    width: 100,
    margin: 0,
  },
  lastInnerBox: {
    width: 100,
    padding: 10,
  },
  rowBox: {
    border: "1 solid black",
    margin: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text2: {
    textAlign: "center",
    fontSize: 12,
    marginBottom: 5,
    wordWrap: "break-word",
    overflowWrap: "break-word",
  },
});

const PDFFile = ({ filtered }) => {
  const grandTotal = filtered
    .reduce((total, transaction) => total + parseFloat(transaction.total), 0)
    .toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Document>
      <Page style={styles.body}>
        <view>
          <Text style={[styles.header, { marginBottom: 0 }]} fixed>
            Republic of the Philippines
          </Text>
          <Text style={[styles.header, { marginBottom: 0 }]} fixed>
            Caraga State University
          </Text>
          <Text style={styles.header} fixed>
            Ampayon, Butuan City 8600, Philippines
          </Text>
        </view>
        <Text style={[styles.title, { marginBottom: 30 }]}>
          Liquidation Report
        </Text>

        <View>
          <View style={[styles.headerBox, { margin: 0 }]}>
            <View style={styles.innerBox}>
              <Text style={styles.text2}>Date</Text>
            </View>
            <View style={styles.innerBox}>
              <Text style={styles.text2}>OR Number</Text>
            </View>
            <View style={styles.innerBox}>
              <Text style={styles.text2}>Buyer</Text>
            </View>
            <View style={styles.innerBox}>
              <Text style={styles.text2}>Seller</Text>
            </View>
            <View style={styles.lastInnerBox}>
              <Text style={styles.text2}>Total(PHP)</Text>
            </View>
          </View>
          {filtered.map((transaction) => (
            <View style={[styles.rowBox, { margin: 0 }]} key={transaction.id}>
              <View style={styles.innerBox}>
                <Text style={styles.text2}>
                  {" "}
                  {new Date(transaction.date * 1000).toLocaleString(undefined, {
                    dateStyle: "medium",
                  })}
                </Text>
              </View>
              <View style={styles.innerBox}>
                <Text style={styles.text2}>{transaction.ornumber}</Text>
              </View>
              <View style={styles.innerBox}>
                <Text style={styles.text2}>{transaction.buyer}</Text>
              </View>
              <View style={styles.innerBox}>
                <Text style={styles.text2}>{transaction.seller}</Text>
              </View>
              {/* <View>
                <Text style={styles.text2}>{transaction.cid}</Text>
              </View> */}
              <View style={styles.lastInnerBox}>
                <Text style={styles.text2}>
                  PHP{" "}
                  {parseFloat(transaction.total).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          ))}
          <View style={[styles.rowBox, { margin: 0 }]}>
            <View style={[styles.innerBox, { width: "70%" }]}>
              <Text
                style={[
                  styles.text2,
                  { fontWeight: "bold", textAlign: "right" },
                ]}
              >
                GRAND TOTAL
              </Text>
            </View>
            <View style={[styles.lastInnerBox]}>
              <Text style={[styles.text2, { fontWeight: "bold" }]}>
                PHP {grandTotal}
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.text}></Text>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default PDFFile;
