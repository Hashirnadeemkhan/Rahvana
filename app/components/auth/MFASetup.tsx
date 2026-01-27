"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function MFASetup() {
  const [step, setStep] = useState<"initial" | "qr" | "verify" | "complete">(
    "initial",
  );
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [factorId, setFactorId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const { enableMFA, verifyMFASetup } = useAuth();

  const handleEnableMFA = async () => {
    setLoading(true);
    setError("");

    const result = await enableMFA();

    if (result.success && result.qrCode && result.secret && result.factorId) {
      console.log('MFA enrollment successful:', result);
      setQrCode(result.qrCode);
      setSecret(result.secret);
      setFactorId(result.factorId);
      setStep("qr");
    } else {
      console.log('MFA enrollment failed:', result.error);
      setError(result.error || "Failed to enable MFA");
    }

    setLoading(false);
  };

  const handleVerifyCode = async () => {
    if (!code.trim() || !factorId) {
      setError("Please enter the verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log('Attempting to verify MFA setup with factorId:', factorId, 'and code:', code);
      const result = await verifyMFASetup(factorId, code);
      console.log('Verification result:', result);

      if (result.success) {
        setStep("complete");
        // Optionally, show a success message to user
        console.log('MFA setup completed successfully');
      } else {
        setError(result.error || "Invalid verification code");
        console.log('MFA setup failed:', result.error);
      }
    } catch (err) {
      console.error('Error during MFA verification:', err);
      setError('Failed to verify MFA setup');
    }

    setLoading(false);
  };

  if (step === "initial") {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4">
          Enable Two-Factor Authentication
        </h2>
        <p className="text-gray-600 mb-6">
          Add an extra layer of security to your account by enabling two-factor
          authentication.
        </p>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={handleEnableMFA} disabled={loading} className="w-full">
          {loading ? "Setting up..." : "Enable 2FA"}
        </Button>
      </Card>
    );
  }

  if (step === "qr") {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-center">Scan QR Code</h2>
        <p className="text-gray-600 mb-4">
          Scan this QR code with your authenticator app (Google Authenticator,
          Authy, etc.)
        </p>

        <div className="flex justify-center my-6">
          <div 
            dangerouslySetInnerHTML={{ __html: qrCode }}
            className="border rounded p-2 max-w-xs"
          />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Can&apos;t scan? Enter this secret code manually:
          <strong>{secret}</strong>
        </p>

        <div className="space-y-4">
          <Input
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={handleVerifyCode}
            disabled={loading || code.length !== 6 || !factorId}
            className="w-full"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>
        </div>
      </Card>
    );
  }

  if (step === "complete") {
    return (
      <Card className="p-6 max-w-md mx-auto">
        <h2 className="text-xl font-bold mb-4 text-green-600">
          ✓ 2FA Enabled Successfully!
        </h2>
        <p className="text-gray-600 mb-6">
          Two-factor authentication has been enabled on your account.
        </p>

        <Button onClick={() => setStep("initial")} className="w-full">
          Done
        </Button>
      </Card>
    );
  }

  return null;
}
