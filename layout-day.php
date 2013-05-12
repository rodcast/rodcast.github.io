<?php
/**
* Lays out events for a single day
*
* @param array  events   An array of event objects. Each event object consists of a start and end
*                                     time (measured in minutes) from 9am, as well as a unique id. The
*                                     start and end time of each event will be [0, 720]. The start time will
*                                     be less than the end time.*
* @return array  An array of event objects that has the width, the left and top positions set, in addition to the id,
*                        start and end time. The object should be laid out so that there are no overlapping
*                        events.
**/
function layOutDay($events) {
    // To make sure it always works, sort events into ascending order based on their start times
    function sortByStart($a, $b) {
        return $a['start'] > $b['start'];
    }
    usort($events, 'sortByStart');
    // Create an auxiliary array used to store left offsets of each event
    $leftOffsets = array();
    // For each event, check all events before it to see if they clash
    for ($i = 0; $i < count($events); $i++) {
        $event = $events[$i];
        // Initialise the event's left offset to 0
        $leftOffsets[$event['id']] = 0;
        for ($j = 0; $j < $i; $j++) {
            $compare = $events[$j];
            if (($compare['start'] <= $event['start'] && $event['start'] <= $compare['end']) || ($compare['start'] <= $event['end'] && $event['end'] <= $compare['end'])) {
                // If the event's left offset position is already taken by an event that it clashes with, increment it
                // This means that an event takes the lowest (leftmost) available position it can fit in
                if ($leftOffsets[$event['id']] == $leftOffsets[$compare['id']]) {
                    $leftOffsets[$event['id']]++;
                }
            }
        }
    }
    // Loop through each event again, working out how many events each clashes with
    // This must be done after the previous loop so that all events already have a left offset calculated
    foreach ($events as &$event) {
        // Create an auxiliary array used to group events by left offsets
        $offsetGroups = array();
        // Initialise the fraction of the width it will use to 1
        $widthFraction = 1;
        foreach ($events as $compare) {
            // If the events are not the same and clash, and it's not already seen a clashing event with this left offset position...
            if ($event['id'] != $compare['id'] && !in_array($leftOffsets[$compare['id']], $offsetGroups) && (($compare['start'] <= $event['start'] && $event['start'] <= $compare['end']) || ($compare['start'] <= $event['end'] && $event['end'] <= $compare['end']))) {
                // Increment the fraction of the width it will take up
                $widthFraction++;
                // Add this event's left offset position to the auxiliary array
                $offsetGroups[] = $leftOffsets[$compare['id']];
            }
        }
        // Event's width is the full space width divided by the fraction it takes up
        $event['width'] = 600 / $widthFraction;
        // Event's top position is just its start time (as both are relative to 9am and in minutes)
        $event['top'] = $event['start'];
        // Event's left position is its left offset multiplied by its calculated width
        $event['left'] = $leftOffsets[$event['id']] * $event['width'];
    }
    return $events;
}
?>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Facebook calendar puzzle</title>
<style type="text/css">
body
{
    font-family: 'lucida grande',tahoma,verdana,arial,sans-serif;
    font-size: 11px;
    line-height: 1.28;
    margin: 0;
    padding: 0;
}
#cal-container
{
    overflow: auto;
    margin: 20px 0;
}
#cal-times
{
    list-style-type: none;
    margin: 0;
    padding: 0;
    float: left;
}
#cal-times .cal-time
{
    margin: 0 9px;
    width: 70px;
    height: 30px;
    color: #A7A7A7;
    font-size: 9px;
    line-height: 13px;
    text-align: right;
}
#cal-times .cal-time .cal-time-major
{
    color: #686868;
    font-size: 13px;
    font-weight: bold;
}
#cal-items-container
{
    margin: 8px 0 22px 88px;
    width: 620px;
    height: 720px;
    background-color: #ECECEC;
    border-width: 0 0 0 1px;
    border-style: solid;
    border-color: #D6D6D6;
}
#cal-items
{
    position: relative;
    margin: 0 10px;
}
#cal-items .cal-item
{
    position: absolute;
    background-color: #4B6EA9;
}
#cal-items .cal-item .cal-item-inner
{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 4px;
    overflow: hidden;
    padding: 8px;
    background-color: #FFF;
    border-width: 1px 1px 1px 0;
    border-style: solid;
    border-color: #D6D6D6;
}
#cal-items .cal-item .cal-item-inner h1,
#cal-items .cal-item .cal-item-inner h2
{
    margin: 0;
    padding: 0 0 3px;
    line-height: 1;
}
#cal-items .cal-item .cal-item-inner h1
{
    color: #4B6EA9;
    font-size: 12px;
    font-weight: bold;
}
#cal-items .cal-item .cal-item-inner h2
{
    color: #797979;
    font-size: 9px;
    font-weight: normal;
}
</style>
</head>
<body>
<div id="cal-container">
<ul id="cal-times">
    <li class="cal-time"><span class="cal-time-major">9:00 </span>AM</li>
    <li class="cal-time">9:30</li>
    <li class="cal-time"><span class="cal-time-major">10:00 </span>AM</li>
    <li class="cal-time">10:30</li>
    <li class="cal-time"><span class="cal-time-major">11:00 </span>AM</li>
    <li class="cal-time">11:30</li>
    <li class="cal-time"><span class="cal-time-major">12:00 </span>PM</li>
    <li class="cal-time">12:30</li>
    <li class="cal-time"><span class="cal-time-major">1:00 </span>PM</li>
    <li class="cal-time">1:30</li>
    <li class="cal-time"><span class="cal-time-major">2:00 </span>PM</li>
    <li class="cal-time">2:30</li>
    <li class="cal-time"><span class="cal-time-major">3:00 </span>PM</li>
    <li class="cal-time">3:30</li>
    <li class="cal-time"><span class="cal-time-major">4:00 </span>PM</li>
    <li class="cal-time">4:30</li>
    <li class="cal-time"><span class="cal-time-major">5:00 </span>PM</li>
    <li class="cal-time">5:30</li>
    <li class="cal-time"><span class="cal-time-major">6:00 </span>PM</li>
    <li class="cal-time">6:30</li>
    <li class="cal-time"><span class="cal-time-major">7:00 </span>PM</li>
    <li class="cal-time">7:30</li>
    <li class="cal-time"><span class="cal-time-major">8:00 </span>PM</li>
    <li class="cal-time">8:30</li>
    <li class="cal-time"><span class="cal-time-major">9:00 </span>PM</li>
</ul>
<div id="cal-items-container">
<div id="cal-items">
<?php
$events = layOutDay(array(
    array('id' => 1, 'start' => 30, 'end' => 150),
    array('id' => 2, 'start' => 540, 'end' => 600),
    array('id' => 3, 'start' => 560, 'end' => 620),
    array('id' => 4, 'start' => 610, 'end' => 670)
));
foreach ($events as $event) {
    echo '<div class="cal-item" style="top:'.$event['top'].'px;left:'.$event['left'].'px;width:'.$event['width'].'px;height:'.($event['end']-$event['start']).'px;"><div class="cal-item-inner"><h1>Sample Item</h1><h2>Sample Location</h2></div></div>';
}
?>
</div>
</div>
</div>
</body>
</html>