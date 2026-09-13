use spacetimedb::{ReducerContext, SpacetimeType, Table, reducer, table};

#[table(accessor = repair_orders, public)]
pub struct RepairOrder {
    #[primary_key]
    number: u32,
    customer: Option<String>,
    all_parts_are_here: bool,
    transfer_orders: Vec<u32>,
    tech_name: TechName,
    notes: String,
}

impl RepairOrder {
    fn new(
        repair_order_number: u32,
        customer: Option<String>,
        all_parts_are_here: Option<bool>,
        transfer_orders: Vec<u32>,
    ) -> Result<Self, String> {
        // test to make sure the repair order number is 8 to 10 digits
        if repair_order_number < 10000000 {
            return Err("Repair Order needs to be correct length".to_string());
        };
        Ok(Self {
            number: repair_order_number,
            customer,
            all_parts_are_here: all_parts_are_here.unwrap_or_default(),
            transfer_orders,
            tech_name: TechName::default(),
            notes: String::default(),
        })
    }
}

#[derive(Default, SpacetimeType)]
pub enum TechName {
    Aaron,
    Andrew,
    Chris,
    Jeremiah,
    JR,
    Justin,
    Nick,
    #[default]
    Other,
}

#[reducer]
pub fn add_or_update_repair_order(
    ctx: &ReducerContext,
    repair_order_number: u32,
    all_parts_are_here: Option<bool>,
    customer: Option<String>,
    transfer_orders: Vec<u32>,
) {
    if let Some(repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        ctx.db.repair_orders().number().update(RepairOrder {
            customer,
            transfer_orders,
            all_parts_are_here: all_parts_are_here.unwrap_or(repair_order.all_parts_are_here),
            ..repair_order
        });
    } else {
        if let Ok(repair_order) = RepairOrder::new(
            repair_order_number,
            customer,
            all_parts_are_here,
            transfer_orders,
        ) {
            ctx.db.repair_orders().insert(repair_order);
        }
    };
}

#[reducer]
pub fn update_tech(ctx: &ReducerContext, repair_order_number: u32, tech_name: TechName) {
    if let Some(repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        ctx.db.repair_orders().number().update(RepairOrder {
            tech_name,
            ..repair_order
        });
    };
}

#[reducer]
pub fn add_transfer_orders(
    ctx: &ReducerContext,
    repair_order_number: u32,
    transfer_orders: Vec<u32>,
) {
    if let Some(mut repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        for transfer_order in transfer_orders {
            repair_order.transfer_orders.push(transfer_order);
        }
        ctx.db.repair_orders().number().update(repair_order);
    };
}

#[reducer]
pub fn remove_transfer_order(ctx: &ReducerContext, repair_order_number: u32, transfer_order: u32) {
    if let Some(mut repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        repair_order
            .transfer_orders
            .retain(|&x| x != transfer_order);
        ctx.db.repair_orders().number().update(repair_order);
    };
}

#[reducer]
pub fn set_all_parts_are_here_status(
    ctx: &ReducerContext,
    repair_order_number: u32,
    all_parts_are_here: bool,
) {
    if let Some(repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        ctx.db.repair_orders().number().update(RepairOrder {
            all_parts_are_here,
            ..repair_order
        });
    };
}

#[reducer]
pub fn update_notes(ctx: &ReducerContext, repair_order_number: u32, notes: String) {
    if let Some(repair_order) = ctx.db.repair_orders().number().find(repair_order_number) {
        ctx.db.repair_orders().number().update(RepairOrder {
            notes,
            ..repair_order
        });
    };
}

#[reducer]
pub fn delete_repair_order(ctx: &ReducerContext, repair_order_number: u32) {
    ctx.db.repair_orders().number().delete(repair_order_number);
}
