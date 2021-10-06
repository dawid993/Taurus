public with sharing class PortalRegistrationController {
    @AuraEnabled
    public static RegistrationResponse register(final RegistrationRequest registrationRequest){
        try {
            return null;        
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class RegistrationRequest {
        @AuraEnabled
        public String firstName {get; set;}

        @AuraEnabled
        public String middleName {get; set;}

        @AuraEnabled
        public String lastName {get; set;}

        @AuraEnabled
        public Date birthday {get; set;}

        @AuraEnabled
        public String email {get; set;}

        @AuraEnabled
        public Boolean isIrnSelected {get; set;}

        @AuraEnabled
        public String irnNumber {get; set;}

        @AuraEnabled
        public String phone {get; set;}

        @AuraEnabled
        public String password {get; set;}
    }   

}
