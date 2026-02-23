<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class RackController extends Controller
{
    public function dataFetching(Request $request)
    {
        $offset = $request->input('offset', 0);
        $limit = $request->input('limit', 10);
        $search = $request->input('search', '');
        $sortBy = $request->input('sortBy', 'id');
        $sortDirection = $request->input('sortDir', 'desc');

        $query = \App\Models\RackPartList::query();

        if ($search) {
            $query->where('rack_no', 'like', "%$search%")
                ->orWhere('item_code', 'like', "%$search%")
                ->orWhere('part_name', 'like', "%$search%");
        }

        if ($sortBy) {
            $query->orderBy($sortBy, $sortDirection);
        }

        //        debugbar()->info($query->count(), 'Total records after filtering',$search);

        return [
            'data' => $query->offset($offset)->limit($limit)->get(),
            'total' => $query->offset($offset)->count(),
        ];
    }

    public function getSingleRack(string $id)
    {
        return \App\Models\RackPartList::find($id);
    }
}
