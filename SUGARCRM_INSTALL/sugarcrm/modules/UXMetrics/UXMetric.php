<?php

/**
 * UX Metric is used to store UX metrics information from tests that observe the
 * user interaction with the system.
 */
class UXMetric extends Basic
{    
    public $table_name = "uxmetrics";
    public $module_name = 'UXMetrics';
    public $module_dir = 'UXMetrics';
    public $object_name = "UXMetric";

    public $id;
    public $name;
    public $email;
    public $type;
    public $clicks;
    public $time;
    public $clicked_elements;
    public $click_trip;
}
