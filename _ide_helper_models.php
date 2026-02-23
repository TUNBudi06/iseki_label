<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoggerPerubahanModel newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoggerPerubahanModel newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|LoggerPerubahanModel query()
 */
	class LoggerPerubahanModel extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $rack_code
 * @property string|null $area_name
 * @property string $label_type
 * @property int $quantity
 * @property int $printed
 * @property int $urgent
 * @property int $auto_print
 * @property string $requested_by
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\RackPartList|null $RackList
 * @property-read mixed $urgent_status
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereAreaName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereAutoPrint($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereLabelType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint wherePrinted($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereQuantity($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereRackCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereRequestedBy($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|QueueLabelPrint whereUrgent($value)
 */
	class QueueLabelPrint extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string|null $rack_no
 * @property string $item_code
 * @property string $part_name
 * @property string|null $cek
 * @property string|null $supplier
 * @property int $part_hydrolis
 * @property string|null $type_tractor
 * @property string|null $satuan
 * @property string|null $sample
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereCek($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereItemCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList wherePartHydrolis($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList wherePartName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereRackNo($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereSample($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereSatuan($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereSupplier($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereTypeTractor($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|RackPartList whereUpdatedAt($value)
 */
	class RackPartList extends \Eloquent {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $username
 * @property string $password
 * @property string $role
 * @property string|null $remember_token
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereRole($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|User whereUsername($value)
 */
	class User extends \Eloquent {}
}

