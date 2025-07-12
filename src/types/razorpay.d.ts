// declare global {
//     interface Window {
//       Razorpay: {
//         new (options: RazorpayOptions): RazorpayInstance;
//       };
//     }
//     interface RazorpayOptions {
//       key: string;
//       amount: number;
//       currency: string;
//       name: string;
//       description: string;
//       order_id: string;
//       handler: () => void;
//       prefill: { email: string };
//       theme: { color: string };
//     }
  
//     interface RazorpayInstance {
//       open: () => void;
//     }
//   }
  
//   export {};