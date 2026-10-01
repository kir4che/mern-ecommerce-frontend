export const submitPaymentForm = (params: Record<string, unknown>) => {
  const paymentUrl =
    import.meta.env.VITE_ECPAY_URL ||
    (import.meta.env.DEV
      ? "https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5"
      : undefined);

  if (!paymentUrl) throw new Error("VITE_ECPAY_URL is required.");

  const form = document.createElement("form");
  form.action = paymentUrl;
  form.method = "POST";
  form.acceptCharset = "UTF-8";
  form.style.display = "none";

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
