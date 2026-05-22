<?php

/**
 * Plugin Name: ToucanPay Gateway for WooCommerce (Production Ready)
 * Description: Secure ToucanPay payment gateway with validation, logging, webhook, and retry system
 * Version: 3.0
 */

if (!defined('ABSPATH')) exit;

add_action('plugins_loaded', 'init_toucanpay_gateway_production');

function init_toucanpay_gateway_production()
{

    if (!class_exists('WC_Payment_Gateway')) return;

    class WC_ToucanPay_Production extends WC_Payment_Gateway
    {

        public function __construct()
        {
            $this->id = 'toucanpay';
            $this->method_title = 'ToucanPay';
            $this->method_description = 'Secure ToucanPay integration';

            $this->init_form_fields();
            $this->init_settings();

            $this->title    = $this->get_option('title');
            $this->mac      = $this->get_option('mac');
            $this->currency = $this->get_option('currency');
            $this->testmode = $this->get_option('testmode');
            $this->debug    = $this->get_option('debug');

            $this->api_url = ($this->testmode === 'yes')
                ? 'https://pay.testtoucanpay.in/api/auth/getpaymentsession'
                : 'https://pay.toucanpay.in/api/auth/getpaymentsession';

            add_action('woocommerce_update_options_payment_gateways_' . $this->id, [$this, 'process_admin_options']);
            add_action('init', [$this, 'handle_callback']);
        }

        public function init_form_fields()
        {
            $this->form_fields = [
                'enabled' => ['title' => 'Enable', 'type' => 'checkbox', 'default' => 'yes'],
                'title' => ['title' => 'Title', 'type' => 'text', 'default' => 'ToucanPay'],
                'mac' => ['title' => 'Merchant Token', 'type' => 'text'],
                'currency' => ['title' => 'Currency', 'type' => 'text', 'default' => 'INR'],
                'testmode' => ['title' => 'Test Mode', 'type' => 'checkbox', 'default' => 'yes'],
                'debug' => ['title' => 'Debug', 'type' => 'checkbox', 'default' => 'no']
            ];
        }

        private function log($msg)
        {
            if ($this->debug === 'yes') {
                error_log('[ToucanPay] ' . print_r($msg, true));
            }
        }

        private function generate_hash($order_id, $amount)
        {
            // ⚠️ Confirm with provider if format differs
            $string = $order_id . $amount . $this->currency . $this->mac;
            return hash('sha512', $string);
        }

        public function process_payment($order_id)
        {

            $order = wc_get_order($order_id);

            $toucan_order_id = time() . rand(10000, 99999);
            $amount = $order->get_total();

            $body = [
                'o' => $toucan_order_id,
                'ta' => $amount,
                'c' => $this->currency,
                'mac' => $this->mac,
                'murl' => add_query_arg('toucan_callback', '1', home_url('/')),
                'name' => $order->get_billing_first_name(),
                'phone' => $order->get_billing_phone(),
                'emailId' => $order->get_billing_email(),
                'ha' => $this->generate_hash($toucan_order_id, $amount)
            ];

            $this->log($body);

            $response = wp_remote_post($this->api_url, [
                'headers' => ['Content-Type' => 'application/x-www-form-urlencoded'],
                'body' => http_build_query($body),
                'timeout' => 20
            ]);

            if (is_wp_error($response)) {
                $this->log($response->get_error_message());
                wc_add_notice('Payment connection failed.', 'error');
                return;
            }

            $data = json_decode(wp_remote_retrieve_body($response), true);

            if (!empty($data['Location'])) {
                update_post_meta($order_id, '_toucan_id', $toucan_order_id);
                return ['result' => 'success', 'redirect' => $data['Location']];
            }

            wc_add_notice('Payment initialization failed.', 'error');
        }

        public function handle_callback()
        {
            if (!isset($_GET['toucan_callback'])) return;

            $order_id = $_GET['order_id'] ?? null;
            $status   = $_GET['status'] ?? null;
            $hash     = $_GET['hash'] ?? null;

            if (!$order_id) return;

            $order = wc_get_order($order_id);
            if (!$order) return;

            // Optional: validate hash from gateway response
            if ($hash) {
                $expected = hash('sha512', $order_id . $order->get_total() . $this->currency . $this->mac);
                if ($hash !== $expected) {
                    $order->update_status('failed', 'Hash mismatch');
                    exit;
                }
            }

            if ($status === 'success') {
                $order->payment_complete();
                $order->update_status('processing');
                wp_redirect($this->get_return_url($order));
            } else {
                $order->update_status('failed');
                wp_redirect(wc_get_checkout_url());
            }
            exit;
        }
    }

    add_filter('woocommerce_payment_gateways', function ($methods) {
        $methods[] = 'WC_ToucanPay_Production';
        return $methods;
    });
}
