
use ic_cdk::{caller};

use crate::get_state;

#[inline(always)]
pub fn owner_guard() -> Result<(), String> {
    if caller() == get_state().owner {
        Ok(())
    } else {
        Err(String::from("The caller is not the owner of contract"))
    }
}