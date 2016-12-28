<?php

$viewdefs['UXMetrics']['base']['view']['list'] = array(
    'panels' => array(
        array(
            'name' => 'panel_header',
            'label' => 'LBL_PANEL_1',
            'fields' => array(
                array(
                    'name' => 'name',
                    'width' => 49,
                    'link' => true,
                    'label' => 'LBL_NAME',
                    'enabled' => true,
                    'default' => true,
                ),
                array(
                    'name' => 'email_addr',
                    'width' => 13,
                    'label' => 'LBL_EMAIL',
                    'enabled' => true,
                    'default' => true,
                ),
                array(
                    'name' => 'type',
                    'width' => 13,
                    'label' => 'LBL_TYPE',
                    'enabled' => true,
                    'default' => true,
                ),
                array(
                    'name' => 'clicks',
                    'width' => '10%',
                    'label' => 'LBL_CLICKS',
                    'default' => true,
                ),
                array(
                    'name' => 'time',
                    'width' => '10%',
                    'label' => 'LBL_TIME',
                    'default' => true,
                ),
                array(
                    'name' => 'click_trip',
                    'width' => '10%',
                    'label' => 'LBL_CLICK_TRIP',
                    'default' => true,
                    'sortable' => false,
                ),
                array(
                    'name' => 'clicked_elements',
                    'width' => '10%',
                    'label' => 'LBL_CLICKED_ELEMENTS',
                    'default' => true,
                    'sortable' => false,
                ),
                array(
                    'name' => 'date_entered',
                    'type' => 'datetime',
                    'label' => 'LBL_DATE_ENTERED',
                    'enabled' => true,
                    'width' => 13,
                    'default' => true,
                ),
            ),

        ),
    ),
);
