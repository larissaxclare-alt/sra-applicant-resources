<?php
/**
 * Plugin Name: SRA Applicant Resource Center
 * Description: Interactive applicant education tools for employment and education verification.
 * Version: 1.0.0
 * Requires at least: 6.0
 * Requires PHP: 7.4
 * Author: SRA Screening (prototype integration)
 * Text Domain: sra-applicant-resources
 */
if (!defined('ABSPATH')) { exit; }

function sra_resources_shortcode() {
    $base = plugin_dir_path(__FILE__);
    $template = $base . 'resources.html';
    if (!is_readable($template)) { return ''; }
    wp_enqueue_style('sra-applicant-resources', plugins_url('assets/style.css', __FILE__), array(), '1.0.0');
    wp_enqueue_script('sra-applicant-resources', plugins_url('assets/app.js', __FILE__), array(), '1.0.0', true);
    // Static, bundled HTML: no applicant data is accepted or stored by this plugin.
    return '<div id="sra-resource-center" class="sra-applicant-resources">' . file_get_contents($template) . '</div>';
}
add_shortcode('sra_applicant_resources', 'sra_resources_shortcode');