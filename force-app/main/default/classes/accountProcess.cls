public with sharing class accountProcess {
    @AuraEnabled(cacheable=true)
    public static list<Account> getAccountList(string searchKey) {
        string sTempSearchKey = '%' + searchKey + '%';
		
       // create account list to store search result 
        list<Account> lstAccount = new list<Account>();
     
	   // query account records
        for(Account accObj : [Select id,Name,Industry,Type,Rating 
                            From Account 
                            WHERE Id!=null AND( Name LIKE : sTempSearchKey OR Industry LIKE: sTempSearchKey OR Type LIKE: sTempSearchKey OR Rating LIKE: sTempSearchKey)]){
                                lstAccount.add(accObj);
        }
		
       //If there are no records found with searchKey then, throw aura exception with a message
         if(lstAccount.size() == 0){
            throw new AuraHandledException('No Record Found..'); 
         }
         
        return lstAccount;
    }

    @AuraEnabled( cacheable = true ) 
    public static List< Account > fetchAccounts( String searchKey ) { 
     
        String strKey = '%' + searchKey + '%'; 
        List<Account> acc = new List<Account>();
        if(searchKey!=null && searchKey!=''){
            acc = [ SELECT Id, Name, Industry, Type, Rating FROM Account WHERE Name LIKE: strKey LIMIT 10 ]; 
        }else{
            acc = [ SELECT Id, Name, Industry, Type, Rating FROM Account LIMIT 10 ]; 
        }
        return acc;
         
    } 
}
