<?php

namespace App\Http\Services\Api;

use Illuminate\Http\Request;

class PaginationService
{
    public function getPaginatedData($query, $column = [])
    {
        $results = request('results', 10);
        $page = request('page', 1);
        $queryData = request('pagination', []);
        $current = $queryData['current'] ?? 1;
        $pageSize = $queryData['pageSize'] ?? 10;
        $total = $queryData['total'] ?? 10;

        $sortBy       = array_key_exists("sortBy", $queryData) ? $queryData['sortBy'] : [];
        $sortDesc     =  array_key_exists("sortDesc", $queryData) ? $queryData['sortDesc'] : [];
        $itemsPerPage = array_key_exists("pageSize", $queryData) ? $queryData['pageSize'] : 10;
        $search_val   = request('search');

        if (count($sortDesc) > 0 && $sortDesc[0]) {
            $orderedBy = 'desc';
        } else {
            $orderedBy = 'asc';
        }
        $start = ($page - 1) * $itemsPerPage;
        if ($search_val && count($column) > 0) {
            $query->where(function ($query) use ($column, $search_val) {
                foreach ($column as $col) {
                    $query->orWhere($col, 'LIKE', '%' . $search_val . '%');
                }
            });
        }
        $pageNumber = $query->count();
        if ($sortBy && $orderedBy) {
            foreach ($sortBy as $sortBy) {
                $query->orderBy($sortBy, $orderedBy);
            }
        }
        if ($itemsPerPage && $itemsPerPage >= 0) {
            $query->skip($start)->take($itemsPerPage);
        }

        $arr_items['data']         = $query;
        $arr_items['totalRecords'] = $pageNumber;
        return $arr_items;
    }
}
