import React, { useState } from "react";
import { Input, Label, SubmitButton } from "./PaymentForm.styled";

const PaymentForm = () => {
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Додати обробку внесених даних для оплати
    // Тут можна виконати відповідні дії, наприклад, відправити дані на сервер або виконати інші дії
    console.log("Дані оплати:", { name, cardNumber, expiryDate, cvv });
    // Очищення форми
    setName("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
  };

  return (
    <PaymentForm onSubmit={handleSubmit}>
      <Label>
        Ім'я на картці:
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Label>
      <Label>
        Номер кредитної/дебетової картки:
        <Input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />
      </Label>
      <Label>
        Термін дії (MM/РР):
        <Input
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          required
        />
      </Label>
      <Label>
        CVV-код:
        <Input
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />
      </Label>
      <SubmitButton type="submit">Заплатити</SubmitButton>
    </PaymentForm>
  );
};

export default PaymentForm;
