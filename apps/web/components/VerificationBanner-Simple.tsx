"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { useResendOtpMutation, useGetMeQuery } from "@/store/apiSlice";
import { setUser, setAuthenticated } from "@/store/slices/authSlice";
import { getErrorMessage } from "@/lib/errors";
import styles from "./verificationBanner.module.css";

export const VerificationBanner = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [resendOtp, { isLoading: resendLoading }] = useResendOtpMutation();

  // Get current auth state from Redux
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useSelector((state: RootState) => state.auth.user);

  // Auto-fetch /me if user is null (Redux cleared on refresh)
  // ✅ This will now work with transformResponse in apiSlice
  const { data: meData, isLoading: meLoading } = useGetMeQuery(undefined, {
    skip: !!user,
  });

  // Update Redux when /me response arrives
  useEffect(() => {
    if (meData) {
      dispatch(
        setUser({
          userId: meData.id,
          email: meData.email,
          name: meData.name || "",  // Handle empty string
          role: meData.role,
          isEmailVerified: meData.isEmailVerified,
          isActive: meData.isActive,
          profileImageUrl: meData.profileImageUrl || undefined,  // Handle missing field
        })
      );

      dispatch(setAuthenticated(true));
    }
  }, [meData, dispatch]);

  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ SIMPLE LOGIC: Show if email NOT verified
  // NO localStorage - always show until email is verified!
  const shouldShowBanner =
    isAuthenticated &&
    user &&
    !user.isEmailVerified &&
    !meLoading;

  if (!shouldShowBanner) {
    return null;
  }

  // User closes banner (temporary hide in current session only)
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      // Don't set showBanner to false - just close the animation
      // Banner will show again on refresh or navigation
    }, 300);
  };

  // User clicks verify → Send OTP and redirect
  const handleVerify = async () => {
    setError("");
    setSuccess("");

    try {
      // Send OTP
      await resendOtp({
        email: user?.email!,
        purpose: "signup",
      }).unwrap();

      setSuccess("OTP sent! Redirecting to verify page...");

      // Redirect to verify page
      setTimeout(() => {
        router.push(
          `/verify?email=${encodeURIComponent(user?.email!)}&purpose=signup`
        );
      }, 1000);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
    }
  };

  return (
    <div className={`${styles.wrapper} ${isClosing ? styles.closing : ""}`}>
      <div className={styles.banner}>
        <div className={styles.content}>
          {/* Icon */}
          <div className={styles.iconContainer}>
            <div className={styles.iconBox}>
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className={styles.message}>
            <h3 className={styles.title}>
              ⓘ Please verify your email address
            </h3>
            <p className={styles.description}>
              We sent a verification link to{" "}
              <span className={styles.email}>{user?.email}</span>. Verify your
              email to unlock all features.
            </p>

            {/* Error */}
            {error && (
              <div className={styles.errorMessage}>
                <span>⚠ {error}</span>
              </div>
            )}

            {/* Success */}
            {success && (
              <div className={styles.successMessage}>
                <span>✓ {success}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button
            className={styles.verifyBtn}
            onClick={handleVerify}
            disabled={resendLoading}
          >
            {resendLoading ? (
              <span className={styles.loading}>
                <span className={styles.pulse}>●</span>
                Sending OTP…
              </span>
            ) : (
              "Verify Now"
            )}
          </button>
          <button
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close banner"
            disabled={resendLoading}
            title="Close (banner will reappear when you navigate)"
          >
            <svg
              className={styles.closeIcon}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationBanner;