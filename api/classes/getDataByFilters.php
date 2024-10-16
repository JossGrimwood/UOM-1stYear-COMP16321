<?php
class getDataByFilters extends request
{
    private $sql;

    function __construct($cargo,$passenger,$tanker,$fishing){
        parent::__construct();
        $this->sql = "SELECT name, id, mmsi, lat, lon, timestamp, imo, callsign, speed, area, type, country, destination, current_port_id, current_port, next_port_id, next_port
        FROM vessels WHERE";
        if ($cargo == "True"){
            $this->sql = $this->sql . " type = 'Cargo' AND";
        }
        if ($passenger == "True"){
            $this->sql = $this->sql . " type = 'Passenger' AND";
        }
        if ($tanker == "True"){
            $this->sql = $this->sql . " type = 'Tanker' AND";
        }
        if ($fishing == "True"){
            $this->sql = $this->sql . " type = 'Fishing' AND";
        }

        $this->sql = substr($this->sql, 0, -4);
    }

    public function getData(){
        $result = $this->db->query($this->sql);
        $data = array();
        while($row = $result->fetch_assoc()) {
            array_push($data, $row);
          }
        return json_encode($data);
    }
}

?>