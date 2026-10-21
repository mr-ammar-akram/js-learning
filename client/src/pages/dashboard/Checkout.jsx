import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useProfile } from "./global/UserContext";
import { Header } from "../view/layout/Header";
import { Footer } from "../view/layout/Footer";

const CARD_IMAGES =
    "https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images";

// Maps the `brand` string Stripe reports (via CardNumberElement's onChange)
// to the logo filenames available in CARD_IMAGES. Brands not in this map
// (diners, jcb, unionpay, unknown) simply show no logo.
const BRAND_IMAGE_MAP = {
    visa: "visa",
    mastercard: "mastercard",
    amex: "amex",
    discover: "discover",
};

// Loaded once, outside the component, so a new Stripe instance isn't
// created on every render.
//
// Vite projects: put VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... in your .env file.
// Create React App projects: swap the line below for
//   loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Shared visual style for the three Stripe Elements fields, tuned to roughly
// match the Tailwind input styling this form used before (text-lg, #1a3b5d).
const ELEMENT_OPTIONS = {
    style: {
        base: {
            fontSize: "18px",
            color: "#1a3b5d",
            fontFamily: "inherit",
            "::placeholder": { color: "#9ca3af" },
        },
        invalid: {
            color: "#dc2626",
        },
    },
};

export default function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { membership_id, membership_name, plan_amount, plan_name } = location.state || {};
    const { getProfileImage } = useProfile();

    const [userId, setUserId] = useState(null);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState({});

    // const [shippingMethod, setShippingMethod] = useState("");

    /*
    |--------------------------------------------------------------------------
    | User Authentication
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        const checkToken = async () => {
            try {
                const storedToken = document.cookie
                    .split("; ")
                    .find((row) => row.startsWith("token="))
                    ?.split("=")[1];

                if (!storedToken) {
                    navigate("/login");
                    return;
                }

                const decoded = jwtDecode(storedToken);

                if (decoded.user_role !== "admin") {
                    navigate("/homepage");
                    return;
                }

                const user_id = decoded.id;
                setUserId(user_id);

                const profileImage =
                    await getProfileImage(user_id);

                if (profileImage) {
                    setUserData(profileImage.data);
                } else {
                    setUserData(decoded);
                }

                setToken(storedToken);
            } catch (error) {
                console.error(
                    "Authentication error:",
                    error
                );

                navigate("/login");
            }
        };

        checkToken();
    }, [navigate, getProfileImage]);

    /*
    |--------------------------------------------------------------------------
    | Service Information
    |--------------------------------------------------------------------------
    */

    const serviceImage =
        localStorage.getItem("service_image");

    const serviceName =
        localStorage.getItem("service_name");

    return (
        <main className="min-h-screen w-full bg-gray-100">

            {/* Header */}

            <Header userData={userData} />

            {/* Main Checkout */}

            <div className="flex w-full flex-col items-center px-4 py-8 md:px-10">

                <h1 className="mb-6 text-3xl font-semibold text-orange-500">
                    Checkout
                </h1>

                <div className="w-full max-w-[1000px]">

                    {/* Service Information */}

                    <div className="rounded-lg border border-t-8 border-t-orange-500 bg-white p-4 shadow-lg">

                        <h2 className="mb-4 ml-2 text-xl font-bold text-gray-900">
                            Service Information
                        </h2>

                        <div className="mb-8 flex items-center">

                            {serviceImage && (
                                <img
                                    className="h-12 w-12 rounded-lg object-cover"
                                    src={serviceImage}
                                    alt={serviceName || "Service"}
                                />
                            )}

                            <div className="ml-3 flex w-full items-center justify-between">

                                <div>
                                    <p className="text-sm font-bold text-gray-900">
                                        {membership_name || "Service Name"}
                                    </p>

                                    <p className="text-xs text-gray-400">
                                        {plan_name || "Plan"}
                                    </p>
                                </div>

                                <p className="text-sm font-bold text-gray-900">
                                    ${plan_amount || "Amount"}
                                </p>

                            </div>
                        </div>

                        {/* Payment Method */}

                        <h2 className="mb-4 ml-2 text-xl font-bold text-gray-900">
                            Payment Method
                        </h2>

                        <div className="rounded-lg bg-orange-50 px-3 py-10">

                            <div className="mx-auto w-full max-w-[900px]">

                                <Elements stripe={stripePromise}>
                                    <PaymentForm
                                        token={token}
                                        membership_id={membership_id}
                                        membership_name={membership_name}
                                        plan_name={plan_name}
                                        plan_amount={plan_amount}
                                        userId={userId}
                                    />
                                </Elements>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}

/*
|--------------------------------------------------------------------------
| Payment Form
|--------------------------------------------------------------------------
| Split out because useStripe()/useElements() only work inside the
| <Elements> provider tree, not in the component that renders <Elements>.
*/

function PaymentForm({ token, membership_id, membership_name, plan_name, plan_amount, userId }) {
    const stripe = useStripe();
    const elements = useElements();
    
    const navigate = useNavigate(); 

    const [cardName, setCardName] = useState("");
    const [cardBrand, setCardBrand] = useState(null);
    const [expiryComplete, setExpiryComplete] = useState(false);
    const [cvcComplete, setCvcComplete] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [isCardFlipped, setIsCardFlipped] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState("");
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    const brandLogo = cardBrand && BRAND_IMAGE_MAP[cardBrand];

    const fieldClasses = (field) => `
        flex
        h-[50px]
        w-full
        items-center
        rounded-lg
        border
        bg-white
        px-4
        outline-none
        transition
        ${
            focusedField === field
                ? "border-orange-500 ring-2 ring-orange-200"
                : "border-gray-300"
        }
    `;
    /*
    |--------------------------------------------------------------------------
    | Payment Submit
    |--------------------------------------------------------------------------
    */

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        setPaymentError("");

        if (!stripe || !elements) {
            setPaymentError("Payment form is still loading. Please try again in a moment.");
            return;
        }

        if (!cardName) {
            setPaymentError("Please enter the name on the card.");
            return;
        }

        setIsProcessing(true);

        try {
            const cardNumberElement = elements.getElement(CardNumberElement);

            // Only one Element is passed here — Stripe automatically pulls the
            // expiry and CVC from the sibling CardExpiryElement/CardCvcElement
            // mounted on the same Elements instance.
            const { token: stripeToken, error: stripeError } =
                await stripe.createToken(cardNumberElement, {
                    name: cardName,
                });

            if (stripeError) {
                setPaymentError(stripeError.message);
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_HOST_URL}/payments/charge`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    stripeToken: stripeToken.id,
                    membership_id,
                    membership_name,
                    userId,
                    plan_name,
                    plan_amount,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Payment failed. Please try again."
                );
            }
            setPaymentSuccess(true);
            navigate("/thankyou", {
                state: {
                    order_id: result.data,
                },
            });
        } catch (err) {
            setPaymentError(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form
            onSubmit={handlePaymentSubmit}
            className="
                rounded-lg
                bg-white
                p-4
                shadow-sm
                md:p-8
            "
        >

            <h3 className="mb-6 text-lg font-bold text-gray-900">
                Card Information
            </h3>

            {/* =====================================================
                CREDIT CARD
            ====================================================== */}

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    mb-[-130px]
                    h-[270px]
                    w-full
                    max-w-[430px]
                    [perspective:2000px]

                    max-[480px]:mb-[-120px]
                    max-[480px]:h-[220px]
                    max-[480px]:max-w-[310px]
                "
            >

                <div
                    className="
                        relative
                        h-full
                        w-full
                        [transform-style:preserve-3d]
                    "
                >

                    {/* =================================================
                        FRONT
                    ================================================== */}

                    <div
                        className={`
                            absolute
                            inset-0
                            h-full
                            w-full
                            overflow-hidden
                            rounded-[15px]
                            shadow-[0_20px_60px_rgba(14,42,90,0.55)]
                            [backface-visibility:hidden]
                            transition-transform
                            duration-[800ms]
                            ease-[cubic-bezier(0.71,0.03,0.56,0.85)]
                            ${
                                isCardFlipped
                                    ? "[transform:perspective(2000px)_rotateY(180deg)]"
                                    : "[transform:perspective(2000px)_rotateY(0deg)]"
                            }
                        `}
                    >

                        <img
                            src={`${CARD_IMAGES}/${
                                Math.floor(
                                    Math.random() * 25
                                ) + 1
                            }.jpeg`}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                        />

                        <div className="absolute inset-0 bg-[rgba(6,2,29,0.45)]" />

                        <div
                            className="
                                relative
                                z-10
                                h-full
                                px-[15px]
                                py-[25px]
                                font-mono
                                text-white
                                select-none
                            "
                        >

                            {/* Chip + Card Logo */}

                            <div className="mb-10 flex items-start justify-between px-2.5">

                                <img
                                    src={`${CARD_IMAGES}/chip.png`}
                                    alt="Chip"
                                    className="w-[60px] max-[480px]:w-[50px]"
                                />

                                <div className="ml-auto flex h-[45px] w-full max-w-[100px] justify-end">
                                    {brandLogo && (
                                        <img
                                            src={`${CARD_IMAGES}/${brandLogo}.png`}
                                            alt={brandLogo}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    )}
                                </div>

                            </div>

                            {/* Card Number — Stripe Elements hide the real
                                digits from our JS, so this is a fixed mask
                                rather than a live reveal. */}

                            <div
                                className="
                                    mb-[35px]
                                    px-[15px]
                                    py-2.5
                                    text-[27px]
                                    font-medium
                                    leading-none
                                    tracking-wide

                                    max-[480px]:text-[21px]
                                "
                            >
                                •••• •••• •••• ••••
                            </div>

                            {/* Bottom */}

                            <div className="flex items-start">

                                <div className="w-full max-w-[calc(100%-85px)] px-[15px] py-2.5">

                                    <div className="mb-1.5 text-xs opacity-70">
                                        Card Holder
                                    </div>

                                    <div className="truncate text-lg uppercase">
                                        {cardName || "Full Name"}
                                    </div>

                                </div>

                                <div className="ml-auto w-[80px] shrink-0 p-2.5 text-lg">

                                    <div className="mb-1.5 text-xs opacity-70">
                                        Expires
                                    </div>
                                    <div>
                                        {expiryComplete ? "•• / ••" : "MM / YY"}
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>

                    {/* =================================================
                        BACK
                    ================================================== */}

                    <div
                        className={`
                            absolute
                            inset-0
                            h-full
                            w-full
                            overflow-hidden
                            rounded-[15px]
                            shadow-[0_20px_60px_rgba(14,42,90,0.55)]
                            [backface-visibility:hidden]
                            transition-transform
                            duration-[800ms]
                            ${
                                isCardFlipped
                                    ? "[transform:perspective(2000px)_rotateY(0deg)]"
                                    : "[transform:perspective(2000px)_rotateY(-180deg)]"
                            }
                        `}
                    >

                        <div className="absolute inset-0 bg-[#1c1d27]" />

                        <div className="relative z-10 mt-[30px] h-[50px] w-full bg-[rgba(0,0,19,0.8)]" />

                        <div className="relative z-10 p-[15px] text-right">

                            <div className="mb-1 pr-2.5 text-sm font-medium text-white">
                                CVV
                            </div>

                            <div className="mb-7 flex h-[45px] items-center justify-end rounded bg-white pr-2.5 text-lg text-[#1a3b5d]">
                                {cvcComplete ? "•••" : ""}
                            </div>

                            {brandLogo && (
                                <div className="ml-auto flex h-[45px] max-w-[100px] justify-end opacity-70">
                                    <img
                                        src={`${CARD_IMAGES}/${brandLogo}.png`}
                                        alt={brandLogo}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </div>
                            )}
                        </div>

                    </div>

                </div>
            </div>

            {/* =====================================================
                FORM
            ====================================================== */}

            <div className="rounded-lg bg-gray-50 px-5 pb-6 pt-[180px]">

                {/* Card Number */}

                <div className="mb-5">

                    <label className="mb-1 block text-sm font-medium text-[#1a3b5d]">
                        Card Number
                    </label>

                    <div className={fieldClasses("number")}>
                        <CardNumberElement
                            options={{ ...ELEMENT_OPTIONS, placeholder: "1234 5678 9012 3456" }}
                            onFocus={() => setFocusedField("number")}
                            onBlur={() => setFocusedField(null)}
                            onChange={(e) => {
                                return setCardBrand(e.brand || null)
                            }}
                            className="w-full"
                        />
                    </div>

                </div>

                {/* Card Holder */}

                <div className="mb-5">

                    <label
                        htmlFor="cardName"
                        className="mb-1 block text-sm font-medium text-[#1a3b5d]"
                    >
                        Card Holder
                    </label>

                    <input
                        type="text"
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        disabled={isProcessing}
                        autoComplete="off"
                        placeholder="Full Name"
                        className="
                            h-[50px]
                            w-full
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-4
                            text-lg
                            text-[#1a3b5d]
                            outline-none
                            focus:border-orange-500
                            focus:ring-2
                            focus:ring-orange-200
                            disabled:opacity-60
                        "
                    />

                </div>

                {/* Expiry + CVV */}

                <div className="flex gap-4 max-[480px]:flex-col">

                    {/* Expiry */}

                    <div className="flex-1">

                        <label className="mb-1 block text-sm font-medium text-[#1a3b5d]">
                            Expiration Date
                        </label>

                        <div className={fieldClasses("expiry")}>
                            <CardExpiryElement
                                options={ELEMENT_OPTIONS}
                                onFocus={() => setFocusedField("expiry")}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => {
                                    return setExpiryComplete(e.complete)
                                }}
                                className="w-full"
                            />
                        </div>

                    </div>

                    {/* CVV */}

                    <div className="w-[150px] max-[480px]:w-full">

                        <label className="mb-1 block text-sm font-medium text-[#1a3b5d]">
                            CVV
                        </label>

                        <div className={fieldClasses("cvc")}>
                            <CardCvcElement
                                options={ELEMENT_OPTIONS}
                                onFocus={() => {
                                    setFocusedField("cvc");
                                    setIsCardFlipped(true);
                                }}
                                onBlur={() => {
                                    setFocusedField(null);
                                    setIsCardFlipped(false);
                                }}
                                onChange={(e) => setCvcComplete(e.complete)}
                                className="w-full"
                            />
                        </div>

                    </div>

                </div>

                {/* Payment feedback */}

                {paymentError && (
                    <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                        {paymentError}
                    </div>
                )}

                {paymentSuccess && (
                    <div className="mt-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        Payment successful! Your subscription to{" "}
                        {membership_name || "this plan"} is now active.
                    </div>
                )}

                {/* Pay Button */}

                <button
                    type="submit"
                    disabled={isProcessing || paymentSuccess || !stripe}
                    className="
                        mt-6
                        h-[55px]
                        w-full
                        rounded-lg
                        bg-orange-500
                        text-lg
                        font-bold
                        text-white
                        transition
                        hover:bg-orange-600
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                    "
                >
                    {paymentSuccess
                        ? "Payment Successful"
                        : isProcessing
                        ? "Processing..."
                        : "Pay Now"}
                </button>

            </div>
        </form>
    );
}
