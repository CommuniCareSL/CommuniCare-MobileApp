import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";

const PaymentGateway = ({
  visible,
  onClose,
  onPaymentSuccess,
  totalPayment,
}) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  const validateCardDetails = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      setError("Please fill in all card details.");
      return false;
    }

    // Simulate card number validation (dummy check)
    // if (cardNumber.replace(/\s/g, "").length !== 16) {
    //   setError("Invalid card number. Please enter a 16-digit card number.");
    //   return false;
    // }

    // Simulate expiry date validation (dummy check)
    // if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    //   setError("Invalid expiry date. Please use the format MM/YY.");
    //   return false;
    // }

    // Simulate CVV validation (dummy check)
    if (cvv.length !== 3) {
      setError("Invalid CVV. Please enter a 3-digit CVV.");
      return false;
    }

    setError("");
    return true;
  };

  const handlePayment = () => {
    if (validateCardDetails()) {
      // Simulate a successful payment
      Alert.alert("Payment Successful", "Your payment has been processed!", [
        {
          text: "OK",
          onPress: () => {
            onPaymentSuccess(); // Notify parent component of successful payment
            onClose(); // Close the payment modal
          },
        },
      ]);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Payment Gateway</Text>
          <Text style={styles.amount}>Total Amount: Rs. {totalPayment}</Text>

          {/* Card Number Input */}
          <TextInput
            style={styles.input}
            placeholder="Card Number"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={(text) => setCardNumber(text)}
            maxLength={19} // 16 digits + 3 spaces
          />

          {/* Expiry Date Input */}
          <TextInput
            style={styles.input}
            placeholder="Expiry Date (MM/YY)"
            keyboardType="numeric"
            value={expiryDate}
            onChangeText={(text) => setExpiryDate(text)}
            maxLength={5}
          />

          {/* CVV Input */}
          <TextInput
            style={styles.input}
            placeholder="CVV"
            keyboardType="numeric"
            value={cvv}
            onChangeText={(text) => setCvv(text)}
            maxLength={3}
          />

          {/* Display Error Message */}
          {error ? <Text style={styles.error}>{error}</Text> : null}

          {/* Pay Button */}
          <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  amount: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  payButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default PaymentGateway;