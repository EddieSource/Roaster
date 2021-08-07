package com.roaster.roaster.roast.vm;
import com.roaster.roaster.roast.Roast;
import com.roaster.roaster.user.vm.UserVM;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RoastVM {
	private long id; 
	private String content; 
	private long date; 
	private UserVM user; 
	public RoastVM(Roast roast) {
		this.setId(roast.getId());
		this.setContent(roast.getContent());
		this.setDate(roast.getTimestamp().getTime());
		this.setUser(new UserVM(roast.getUser()));
	}
	
}
