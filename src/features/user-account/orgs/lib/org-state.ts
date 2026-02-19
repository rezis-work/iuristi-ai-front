"use client";

import { useQueryState } from 'nuqs';



export function useORgs() {
    const [orgs, setOrgs]= useQueryState("org",{
        defaultValue:"default" 
    })

    return {orgs, setOrgs}
}



