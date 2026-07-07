import React from "react";
import "./verify.css";

export default function EmailVerify() {
    return(
        <div class="email-wrapper">
                <div class="email-message-box">
                    <span class="main-logo">Website Logo</span>
                    <div class="email-message">
                        <h1 class="email-header">Verify your sign-up</h1>
                        <p class="email-body">we have received a sign-up attempt with the following code.. Please enter it in the browser windoe where you started signing up. </p>
                    </div>
                    <div class="otp-verification-code">
                        <input type="text" />
                    </div>
                    <div class="email-content">
                        <p>If you did not attempt to sign up but receive this email, please disregard it. This code will remain active for 10 miutes.
                        </p>
                    </div>
                    <div class="email-footer">
                        <hr />
                        <p>© 2026, All rights reserved.</p>
                    </div>
                </div>
        </div>
    )
}