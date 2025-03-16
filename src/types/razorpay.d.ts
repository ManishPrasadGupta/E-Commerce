declare global {
    interface Window {
      Razorpay: {
        new (options: RazorpayOptions): RazorpayInstance;
      };
    }
  
    interface RazorpayInstance {
      open: () => void;
    }
  }
  
  export {};