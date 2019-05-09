/**
 * @NApiVersion 2.x
 * @NScriptType MapReduceScript
 */

var RECORDMDL;
var SEARCHMDL;

define([ 'N/record', 'N/search' ], runScript);
function runScript(record, search)
{
	RECORDMDL = record;
	SEARCHMDL = search;

	return {
		getInputData : function(context)
		{

			var LOG_TITLE = 'getInputData';
			try
			{
				log.debug(LOG_TITLE, '>> START <<');

				var arrContacts = getContacts();
				log
						.audit('test', 'arrContacts: '
								+ JSON.stringify(arrContacts));

				log.debug(LOG_TITLE, '>> END <<');
				return arrContacts;
			} catch (ex)
			{
				var errorString = (ex instanceof nlobjError) ? ex.getCode()
						+ '\n' + ex.getDetails() : ex.toString();
				log.error(LOG_TITLE, errorString);
			}
		},

		map : function(context)
		{

			var LOG_TITLE = 'map';
			log.debug(LOG_TITLE, '>> START <<');

			try
			{
				log.audit('test', context.value);
				var objContact = JSON.parse(context.value);

				log.audit('test', 'id: ' + objContact.id);

				record.submitFields({
					type : 'contact',
					id : objContact.id,
					values : {
						custentity_curr_stu_year : objContact.startLevel
					}
				});
			} catch (ex)
			{
				var errorString = (ex instanceof nlobjError) ? ex.getCode()
						+ '\n' + ex.getDetails() : ex.toString();
				log.error(LOG_TITLE, errorString);
			}

			log.debug(LOG_TITLE, '>> END <<');
		}
	};
}

/**
 * Get contacts with empty current year and non empty start level
 * 
 * @returns
 */
function getContacts()
{
	var arrContacts = [];

	var contactSearchObj = SEARCHMDL.create({
		type : "contact",
		filters : [ [ "custentity_ste_is_student", "is", "T" ], "AND",
				[ "custentity_curr_stu_year", "isempty", "" ], "AND",
				[ "custentity_stu_year", "isnotempty", "" ] ],
		columns : [ SEARCHMDL.createColumn({
			name : "custentity_curr_stu_year",
		}), SEARCHMDL.createColumn({
			name : "custentity_stu_year",
		}) ]
	});

	contactSearchObj.run().each(function(result)
	{
		var objContact = {};
		objContact.id = result.id;
		objContact.startLevel = result.getValue('custentity_stu_year');

		arrContacts.push(objContact);
		return true;
	});

	return arrContacts;
}