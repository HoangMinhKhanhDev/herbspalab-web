declare const mailer: {
    sendOrderConfirmation(to: string, order: any): Promise<void>;
    sendPasswordReset(to: string, token: string): Promise<void>;
};
export default mailer;
//# sourceMappingURL=mailer.d.ts.map